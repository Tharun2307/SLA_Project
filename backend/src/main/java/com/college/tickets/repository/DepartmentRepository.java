package com.college.tickets.repository;

import com.college.tickets.model.Department;
import com.college.tickets.model.DepartmentName;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends MongoRepository<Department, String> {

    Optional<Department> findByName(DepartmentName name);

    List<Department> findAllByOrderByHonorScoreDesc();
}
