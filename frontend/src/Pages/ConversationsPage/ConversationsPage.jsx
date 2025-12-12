import "../ConversationsPage/ConversationsPage.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { connectWS, sendMessageWS } from "./messagefunction";

function ConversationsPage() {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const myName = sessionStorage.getItem("name");

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const bottomRef = useRef();
  const inputRef = useRef();

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages]);

  // Load conversations
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setConversations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Conversation load error:", err.response?.data || err);
        setLoading(false);
      });
  }, [token]);

  // Open a chat
  const openChat = (conv) => {
    setActiveConv(conv);
    setMessages([]);

    axios
      .get(
        `http://localhost:8080/api/chat/messages/${conv.conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setMessages(res.data))
      .catch((err) =>
        console.error("Messages load error:", err.response?.data || err)
      );
  };

  // WebSocket listener
  useEffect(() => {
    if (!userId) return;

    connectWS(userId, (msg) => {
      console.log("🔥 New WS message:", msg);

      // 🛑 Prevent duplicate messages (sender side)
      setMessages((prev) => {
        if (prev.some((m) => m.timestamp === msg.timestamp)) return prev;
        if (activeConv?.conversationId !== msg.conversationId) return prev;
        return [...prev, msg];
      });

      // Update conversation preview
      setConversations((prev) =>
        prev.map((c) =>
          c.conversationId === msg.conversationId
            ? { ...c, lastMessage: msg.text, updatedAt: msg.timestamp }
            : c
        )
      );
    });
  }, [activeConv, userId]);

  // Send message (NO LOCAL PUSH — WS will add it)
  const sendMsg = () => {
    if (!msgText.trim() || !activeConv) return;

    const msgObj = {
      conversationId: activeConv.conversationId,
      fromUserId: userId,
      toUserId: activeConv.otherUserId,
      text: msgText.trim(),
      timestamp: Date.now(),
    };

    sendMessageWS(msgObj); // Sender does NOT locally add it
    setMsgText("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className={`conversations-sidebar ${activeConv ? 'mobile-hidden' : ''}`}>
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              <img 
                src={sessionStorage.getItem("profileImage")} 
                alt="User" 
                className="user-avatar-img"
                onError={(e) => { e.target.src = "https://avatar.iran.liara.run/public/boy"; }}
                style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}
              />
            </div>
            <div className="user-details">
              <h3 className="user-name">{myName || "User"}</h3>
              <div className="user-status online">Online</div>
            </div>
          </div>
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="conversations-list">
          {loading ? (
            <div className="loading-conversations">
              <div className="loading-spinner"></div>
              <p>Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="empty-conversations">
              <div className="empty-icon">💬</div>
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.conversationId}
                className={`conversation-item ${
                  activeConv?.conversationId === conv.conversationId
                    ? "active"
                    : ""
                }`}
                onClick={() => openChat(conv)}
              >
                <div className="conversation-avatar">
                  <img 
                    src={conv.otherProfileImage || "https://avatar.iran.liara.run/public/boy"} 
                    alt={conv.otherName}
                    className="conv-avatar-img"
                    onError={(e) => { e.target.src = "https://avatar.iran.liara.run/public/boy"; }}
                    style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}
                  />
                  <div className="online-indicator"></div>
                </div>

                <div className="conversation-content">
                  <div className="conversation-header">
                    <h4 className="conversation-name">{conv.otherName}</h4>
                    <span className="conversation-time">
                      {formatTime(conv.updatedAt)}
                    </span>
                  </div>

                  <div className="conversation-preview">
                    <p className="last-message">
                      {conv.lastMessage || "Start a conversation"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`chat-area ${!activeConv ? 'mobile-hidden' : ''}`}>
        {!activeConv ? (
          <div className="welcome-chat">
            <div className="welcome-icon">💚</div>
            <h2>Welcome to Greenify Messages</h2>
            <p>Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <button className="back-button" onClick={() => setActiveConv(null)}>
                  ←
                </button>
                <div className="user-avatar">
                  <img 
                    src={activeConv.otherProfileImage || "https://avatar.iran.liara.run/public/boy"} 
                    alt={activeConv.otherName}
                    className="chat-header-avatar"
                    onError={(e) => { e.target.src = "https://avatar.iran.liara.run/public/boy"; }}
                    style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}
                  />
                </div>
                <div className="user-details">
                  <h3 className="user-name">{activeConv.otherName}</h3>
                  <div className="user-status online">Online</div>
                </div>
              </div>
            </div>

            <div className="messages-container">
              <div className="messages-list">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.fromUserId === userId ? "sent" : "received"
                    }`}
                  >
                    <div className="message-content">
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">
                        {formatTime(message.timestamp)}
                        {message.fromUserId === userId && (
                          <span className="message-status">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef}></div>
              </div>
            </div>

            <div className="message-input-container">
              <div className="input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="message-input"
                  maxLength="500"
                />
              </div>
              <button
                onClick={sendMsg}
                disabled={!msgText.trim()}
                className="send-button"
              >
                ➤
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ConversationsPage;
