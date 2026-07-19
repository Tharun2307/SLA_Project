package com.college.tickets.repository;

import com.college.tickets.model.Role;
import com.college.tickets.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByDepartmentId(String departmentId);

    List<User> findByRole(Role role);

    List<User> findByDepartmentIdAndRole(String departmentId, Role role);
}
