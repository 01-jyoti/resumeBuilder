package com.resumebuilder.resume_builder.repository;

import com.resumebuilder.resume_builder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}