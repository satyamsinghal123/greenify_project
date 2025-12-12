import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectWS = (userId, onReceive) => {
  if (!userId) return;

  console.log("WS: Connecting as", userId);

  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 3000,
    debug: (str) => console.log(str),

    onConnect: () => {
      console.log("WS CONNECTED:", userId);

      // FINAL CORRECT PATH
      const path = `/queue/messages-${userId}`;
      console.log("SUBSCRIBING TO:", path);

      stompClient.subscribe(path, (msg) => {
        const data = JSON.parse(msg.body);
        console.log("🔥 RECEIVED:", data);
        onReceive(data);
      });
    },

    onStompError: (frame) => {
      console.error("STOMP ERROR:", frame.headers["message"]);
    }
  });

  stompClient.activate();
};


export const sendMessageWS = (msgObj) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("WS NOT CONNECTED");
    return;
  }

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(msgObj),
  });
};
