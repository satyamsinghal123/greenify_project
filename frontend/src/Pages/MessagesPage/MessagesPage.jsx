import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { connectWS, sendMessageWS } from "../ConversationsPage/messagefunction";

function MessagesPage() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [otherUserId, setOtherUserId] = useState("");

  const token = sessionStorage.getItem("token");
  const myId = sessionStorage.getItem("userId");

  const bottomRef = useRef();

  // Load old messages
  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        `http://localhost:8080/api/chat/messages/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);

      const conv = await axios.get(
        "http://localhost:8080/api/chat/conversations",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const c = conv.data.find((x) => x.conversationId === conversationId);

      if (c) {
        setOtherUser(c.otherName);

        // decrypt actual id
        const dec = await axios.get(
          `http://localhost:8080/api/decrypt/${c.otherUserKey}`
        );

        setOtherUserId(dec.data.id);
      }
    };

    load();
  }, [conversationId]);

  // Scroll newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect WebSocket once
  useEffect(() => {
    connectWS(myId, (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;

    const msg = {
      conversationId,
      fromUserId: myId,
      toUserId: otherUserId,
      text,
      timestamp: Date.now(),
    };

    sendMessageWS(msg);

    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div className="chat-container">
      <div className="chat-right">
        <div className="chat-header">{otherUser}</div>

        <div className="chat-body">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`chat-bubble ${
                m.fromUserId === myId ? "me" : "them"
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        <div className="chat-input-box">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
