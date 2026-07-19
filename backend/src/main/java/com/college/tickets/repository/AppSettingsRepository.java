package com.college.tickets.repository;

import com.college.tickets.model.AppSettings;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppSettingsRepository extends MongoRepository<AppSettings, String> {
}
