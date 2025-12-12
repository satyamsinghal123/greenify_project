package com.backend.backkend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.backend.backkend.entity.ConversationEntity;
import java.util.List;

public interface ConversationRepository extends MongoRepository<ConversationEntity, String> {
    List<ConversationEntity> findByParticipantsContaining(String userId);
    ConversationEntity findByParticipantsIn(List<String> participants); // optional helper
}
