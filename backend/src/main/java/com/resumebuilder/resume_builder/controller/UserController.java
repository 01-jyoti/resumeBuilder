// package com.resumebuilder.resume_builder.controller;

// import com.resumebuilder.resume_builder.model.User;
// import com.resumebuilder.resume_builder.service.UserService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.Optional;

// @RestController
// @RequestMapping("/api/auth")
// @CrossOrigin(origins = "*") // Allows frontend to communicate with backend
// public class UserController {

//     @Autowired
//     private UserService userService;

//     @PostMapping("/register")
//     public ResponseEntity<?> register(@RequestBody User user) {
//         try {
//             User savedUser = userService.registerUser(user);
//             return ResponseEntity.ok(savedUser);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Error: Email already exists or invalid data.");
//         }
//     }

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody User loginRequest) {
//         Optional<User> user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPasswordHash());
//         if (user.isPresent()) {
//             return ResponseEntity.ok(user.get());
//         } else {
//             return ResponseEntity.status(401).body("Invalid email or password");
//         }
//     }
// }
// ----------------------------------------------------------------------2----------------------------------------------



// package com.resumebuilder.resume_builder.controller;

// import com.resumebuilder.resume_builder.model.User;
// import com.resumebuilder.resume_builder.service.UserService;
// import com.resumebuilder.resume_builder.repository.ResumeRepository; // Import your resume repository
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.Map;
// import java.util.Optional;

// @RestController
// @RequestMapping("/api/auth")
// @CrossOrigin(origins = "*")
// public class UserController {

//     @Autowired
//     private UserService userService;

//     @Autowired
//     private ResumeRepository resumeRepository; // Used to check if user has profile data

//     @PostMapping("/register")
//     public ResponseEntity<?> register(@RequestBody User user) {
//         try {
//             User savedUser = userService.registerUser(user);
//             return ResponseEntity.ok(savedUser);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Error: Email already exists or invalid data.");
//         }
//     }

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody User loginRequest) {
//         Optional<User> optionalUser = userService.loginUser(loginRequest.getEmail(), loginRequest.getPasswordHash());
        
//         if (optionalUser.isPresent()) {
//             User user = optionalUser.get();
            
//             // Check if this user has created a resume/profile info yet
//             boolean hasProfileInfo = resumeRepository.existsByUser(user); // Make sure this method exists in your ResumeRepository
            
//             // Build a response object containing the user info AND the redirection path
//             Map<String, Object> response = new HashMap<>();
//             response.put("user", user);
            
//             if (!hasProfileInfo) {
//                 response.put("redirectUrl", "/enterInfo.html"); // New user page
//             } else {
//                 response.put("redirectUrl", "/dashboard.html"); // Existing user dashboard
//             }
            
//             return ResponseEntity.ok(response);
//         } else {
//             return ResponseEntity.status(401).body("Invalid email or password");
//         }
//     }
// }

// -------------------------------------------------------------------3----------------------------------------------



package com.resumebuilder.resume_builder.controller;

import com.resumebuilder.resume_builder.model.User;
import com.resumebuilder.resume_builder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody User user) {
    try {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    } catch (Exception e) {
        e.printStackTrace(); // <-- This will print the exact database/null-pointer error in your IDE/terminal!
        return ResponseEntity.status(400).body("Error: " + e.getMessage());
    }
}

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User loginRequest) {
    // Change getPassword() to getPasswordHash() here
    Optional<User> optionalUser = userService.loginUser(loginRequest.getEmail(), loginRequest.getPasswordHash());
    
    if (optionalUser.isPresent()) {
        User user = optionalUser.get();
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        
        // Check if the user has completed their info
        if (!user.isHasCompletedInfo()) {
    response.put("redirectUrl", "enterInfo.html"); // Clean filename path
} else {
    response.put("redirectUrl", "dashboard.html"); // Clean filename path
}
        
        return ResponseEntity.ok(response);
    } else {
        return ResponseEntity.status(401).body("Invalid email or password");
    }
}
}