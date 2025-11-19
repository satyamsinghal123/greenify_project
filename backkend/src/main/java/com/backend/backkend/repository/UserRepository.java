package com.backend.backkend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.backend.backkend.entity.UserEntity;

public interface UserRepository extends MongoRepository<UserEntity, String> {
    UserEntity findByEmail(String email);
}
