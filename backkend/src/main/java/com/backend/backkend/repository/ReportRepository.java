package com.backend.backkend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.backend.backkend.entity.ReportEntity;

public interface ReportRepository extends MongoRepository<ReportEntity, String> {
}
