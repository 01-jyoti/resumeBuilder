package com.resumebuilder.resume_builder.controller;

import com.resumebuilder.resume_builder.model.Resume;
import com.resumebuilder.resume_builder.model.User;
import com.resumebuilder.resume_builder.repository.ResumeRepository;
import com.resumebuilder.resume_builder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getResumeByUserId(@PathVariable Long userId) {
        List<Resume> resumes = resumeRepository.findByUserUserId(userId);
        if (!resumes.isEmpty()) {
            Resume resume = resumes.get(0);
            if ((resume.getFullName() == null || resume.getFullName().trim().isEmpty()) && resume.getUser() != null) {
                resume.setFullName(resume.getUser().getFullName());
            }
            if ((resume.getEmail() == null || resume.getEmail().trim().isEmpty()) && resume.getUser() != null) {
                resume.setEmail(resume.getUser().getEmail());
            }
            return ResponseEntity.ok(resume);
        } else {
            return ResponseEntity.status(404).body("No resume found for this user");
        }
    }

    @PostMapping("/save/{userId}")
    public ResponseEntity<?> saveResume(@PathVariable Long userId, @RequestBody Resume resume) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                // If fullName is provided, sync with user
                if (resume.getFullName() != null && !resume.getFullName().trim().isEmpty()) {
                    user.setFullName(resume.getFullName().trim());
                }
                
                // Check if the user already has a resume saved
                List<Resume> existingResumes = resumeRepository.findByUserUserId(userId);
                if (!existingResumes.isEmpty()) {
                    // Reuse the existing ID so Hibernate updates the existing row instead of inserting a duplicate
                    Resume existingResume = existingResumes.get(0);
                    resume.setId(existingResume.getId());
                }

                resume.setUser(user);
                resumeRepository.save(resume);

                user.setHasCompletedInfo(true);
                userRepository.save(user);

                return ResponseEntity.ok("Resume saved successfully!");
            } else {
                return ResponseEntity.status(404).body("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(500).body("Server Error: " + e.getMessage());
        }
    }
}