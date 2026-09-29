# ResumeCraft – Full-Stack Resume Builder

ResumeCraft is a full-stack web application that allows users to create and manage professional resumes.

Users can enter their personal information, education, technical skills, projects, and work experience. The data is stored in MySQL and managed through a Java Spring Boot backend.

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- Fetch API

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST API
- Thymeleaf

### Database
- MySQL

---

## 📁 Project Structure

```text
ResumeCraft/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── enter-info.html
│   │
│   ├── css/
│   ├── js/
│   └── assets/
│
├── backend/
│   └── resume_builder/
│       ├── src/
│       │   └── main/
│       │       ├── java/
│       │       │   └── com/
│       │       │       └── resumebuilder/
│       │       │           └── resume_builder/
│       │       │               ├── controller/
│       │       │               ├── service/
│       │       │               ├── repository/
│       │       │               ├── model/
│       │       │               └── ResumeBuilderApplication.java
│       │       │
│       │       └── resources/
│       │           ├── application.properties
│       │           └── templates/
│       │               ├── modern.html
│       │               ├── professional.html
│       │               └── minimal.html
│       │
│       └── pom.xml
│
└── database/
    └── schema.sql