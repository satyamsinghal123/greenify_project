package com.backend.backkend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.backend.backkend.entity.ChatMessage;
import com.backend.backkend.entity.MessageEntity;
import com.backend.backkend.repository.MessageRepository;
@Controller
public class ChatWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository msgRepo;

    @MessageMapping("/chat.send")
    public void send(ChatMessage msg) {

        MessageEntity m = new MessageEntity();
        m.setId("M" + System.currentTimeMillis());
        m.setConversationId(msg.getConversationId());
        m.setFromUserId(msg.getFromUserId());
        m.setToUserId(msg.getToUserId());
        m.setText(msg.getText());
        m.setTimestamp(msg.getTimestamp());
        m.setDelivered(true);

        msgRepo.save(m);

        // SEND TO RECEIVER
        messagingTemplate.convertAndSend(
                "/queue/messages-" + msg.getToUserId(),
                msg
        );

        // SEND TO SENDER
        messagingTemplate.convertAndSend(
                "/queue/messages-" + msg.getFromUserId(),
                msg
        );
    }
}
