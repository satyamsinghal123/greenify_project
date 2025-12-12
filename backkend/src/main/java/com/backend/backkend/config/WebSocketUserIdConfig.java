package com.backend.backkend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;

@Configuration
public class WebSocketUserIdConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {

        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message,
                                      org.springframework.messaging.MessageChannel channel) {

                // Use WebSocket session ID as principal userId
                String sessionId = (String) message.getHeaders().get("simpSessionId");

                Principal user = () -> sessionId;  // assign Principal name = sessionId

                return org.springframework.messaging.support.MessageBuilder
                        .fromMessage(message)
                        .setHeader("simpUser", user)
                        .build();
            }
        });
    }
}
