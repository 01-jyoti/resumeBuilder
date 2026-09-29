package com.resumebuilder.resume_builder.service;

import com.resumebuilder.resume_builder.model.User;
import com.resumebuilder.resume_builder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Optional: Add password hashing here later (e.g., BCrypt)
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String email, String password) {
    Optional<User> userOpt = userRepository.findByEmail(email);
    if (userOpt.isPresent()) {
        User user = userOpt.get();
        
        // --- ADD THESE DEBUG PRINTS ---
        System.out.println("User found in DB: " + user.getEmail());
        System.out.println("Stored Password Hash in DB: " + user.getPasswordHash());
        System.out.println("Password received from request: " + password);
        // -----------------------------
        
        if (user.getPasswordHash() != null && user.getPasswordHash().equals(password)) {
            return Optional.of(user);
        } else {
            System.out.println("Password mismatch!");
        }
    } else {
        System.out.println("No user found with email: " + email);
    }
    return Optional.empty();
}
}