package com.backend.backkend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.backend.backkend.entity.PostEntity;
import java.util.List;

public interface PostRepository extends MongoRepository<PostEntity, String> {
    List<PostEntity> findByUserId(String userId);
}
