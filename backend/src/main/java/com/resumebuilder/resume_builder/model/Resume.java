package com.resumebuilder.resume_builder.model;

import jakarta.persistence.*;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_id")
    private Long resumeId;

    @Column(name = "resume_name")
    private String resumeName;

    // Many resumes can belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Personal / Summary Info
    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email")
    private String email;

    private String jobTitle;
    private String phone;
    private String location;
    @Column(length = 1000)
    private String summary;
    private String linkedin;
    private String github;
    private String portfolio;

    // Education
    private String degree;
    private String institution;
    private Integer startYear;
    private Integer endYear;
    private String grade;

    // Skills (Stored as a comma-separated string)
    @Column(length = 1000)
    private String skills;

    // Project
    private String projectName;
    @Column(length = 1000)
    private String technologies;
    @Column(length = 2000)
    private String projectDescription;
    private String projectGithub;
    private String projectLive;

    // Experience
    private String company;
    private String experienceTitle;
    private String experienceStart;
    private String experienceEnd;
    @Column(length = 2000)
    private String experienceDescription;

    public Resume() {}

    // --- Primary ID Getters & Setters (Supports both names for safety) ---
    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }

    // Helper aliases so .getId() and .setId() also work without errors
    public Long getId() { return resumeId; }
    public void setId(Long id) { this.resumeId = id; }

    // --- Other Getters and Setters ---
    public String getResumeName() { return resumeName; }
    public void setResumeName(String resumeName) { this.resumeName = resumeName; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public Integer getStartYear() { return startYear; }
    public void setStartYear(Integer startYear) { this.startYear = startYear; }

    public Integer getEndYear() { return endYear; }
    public void setEndYear(Integer endYear) { this.endYear = endYear; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getTechnologies() { return technologies; }
    public void setTechnologies(String technologies) { this.technologies = technologies; }

    public String getProjectDescription() { return projectDescription; }
    public void setProjectDescription(String projectDescription) { this.projectDescription = projectDescription; }

    public String getProjectGithub() { return projectGithub; }
    public void setProjectGithub(String projectGithub) { this.projectGithub = projectGithub; }

    public String getProjectLive() { return projectLive; }
    public void setProjectLive(String projectLive) { this.projectLive = projectLive; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getExperienceTitle() { return experienceTitle; }
    public void setExperienceTitle(String experienceTitle) { this.experienceTitle = experienceTitle; }

    public String getExperienceStart() { return experienceStart; }
    public void setExperienceStart(String experienceStart) { this.experienceStart = experienceStart; }

    public String getExperienceEnd() { return experienceEnd; }
    public void setExperienceEnd(String experienceEnd) { this.experienceEnd = experienceEnd; }

    public String getExperienceDescription() { return experienceDescription; }
    public void setExperienceDescription(String experienceDescription) { this.experienceDescription = experienceDescription; }
}