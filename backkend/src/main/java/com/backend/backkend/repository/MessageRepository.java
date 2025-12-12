package com.backend.backkend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.backend.backkend.entity.MessageEntity;
import java.util.List;

public interface MessageRepository extends MongoRepository<MessageEntity, String> {
    List<MessageEntity> findByConversationIdOrderByTimestampAsc(String conversationId);
    long countByConversationId(String conversationId);
}
