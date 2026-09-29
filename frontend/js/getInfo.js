document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("resumeForm");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.querySelector(".cancel");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }

  // Retrieve logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    if (storedUser.fullName && document.getElementById("fullName")) {
      document.getElementById("fullName").value = storedUser.fullName;
    }
    if (storedUser.email && document.getElementById("email")) {
      document.getElementById("email").value = storedUser.email;
    }

    // Attempt to prefetch existing resume data from the database
    if (storedUser.userId) {
      try {
        const res = await fetch(`http://localhost:8080/api/resumes/user/${storedUser.userId}`);
        if (res.ok) {
          const d = await res.json();
          if (d) {
            if (d.fullName || (d.user && d.user.fullName)) {
              document.getElementById("fullName").value = d.fullName || d.user.fullName;
            }
            if (d.email || (d.user && d.user.email)) {
              document.getElementById("email").value = d.email || d.user.email;
            }
            if (d.jobTitle) document.getElementById("jobTitle").value = d.jobTitle;
            if (d.phone) document.getElementById("phone").value = d.phone;
            if (d.location) document.getElementById("location").value = d.location;
            if (d.linkedin) document.getElementById("linkedin").value = d.linkedin;
            if (d.github) document.getElementById("github").value = d.github;
            if (d.portfolio) document.getElementById("portfolio").value = d.portfolio;
            if (d.summary) document.getElementById("summary").value = d.summary;

            if (d.degree) document.getElementById("degree").value = d.degree;
            if (d.institution) document.getElementById("institution").value = d.institution;
            if (d.startYear) document.getElementById("startYear").value = d.startYear;
            if (d.endYear) document.getElementById("endYear").value = d.endYear;
            if (d.grade) document.getElementById("grade").value = d.grade;

            if (d.skills) document.getElementById("skills").value = d.skills;

            if (d.projectName) document.getElementById("projectName").value = d.projectName;
            if (d.technologies) document.getElementById("technologies").value = d.technologies;
            if (d.projectDescription) document.getElementById("projectDescription").value = d.projectDescription;
            if (d.projectGithub) document.getElementById("projectGithub").value = d.projectGithub;
            if (d.projectLive) document.getElementById("projectLive").value = d.projectLive;

            if (d.company) document.getElementById("company").value = d.company;
            if (d.experienceTitle) document.getElementById("experienceTitle").value = d.experienceTitle;
            if (d.experienceStart) document.getElementById("experienceStart").value = d.experienceStart;
            if (d.experienceEnd) document.getElementById("experienceEnd").value = d.experienceEnd;
            if (d.experienceDescription) document.getElementById("experienceDescription").value = d.experienceDescription;
          }
        }
      } catch (e) {
        console.warn("Could not prefill resume from database:", e);
      }
    }
  }

  // Required fields for initial profile setup
  const primaryRequiredFields = [
    "fullName",
    "jobTitle",
    "email",
    "phone",
    "location",
    "summary",
    "degree",
    "institution",
    "startYear",
    "endYear",
    "skills"
  ];

  primaryRequiredFields.forEach((id) => {
    const field = document.getElementById(id);
    if (field) {
      field.required = true;
    }
  });

  // Phone → numbers only
  const phone = document.getElementById("phone");
  if (phone) {
    phone.addEventListener("input", () => {
      phone.value = phone.value.replace(/\D/g, "");
    });
  }

  // Start / End year → numbers only
  ["startYear", "endYear"].forEach((id) => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener("input", () => {
        field.value = field.value.replace(/\D/g, "");
      });
      field.min = "1900";
      field.max = "2100";
    }
  });

  // Submit form and save to database
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Check required fields
    for (const id of primaryRequiredFields) {
      const field = document.getElementById(id);
      if (field && field.value.trim() === "") {
        field.focus();
        field.scrollIntoView({ behavior: "smooth", block: "center" });
        field.reportValidity();
        return;
      }
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // 2. Retrieve logged-in user from localStorage
    let currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser || !currentUser.userId) {
      // Fallback: If running in standalone test without logging in first, use default test user ID 1
      currentUser = { userId: 1, fullName: "Student", email: "student@example.com" };
      localStorage.setItem("user", JSON.stringify(currentUser));
    }

    // 3. Build payload matching backend Resume model (including fullName and email!)
    const fullNameVal = document.getElementById("fullName")?.value.trim() || "";
    const emailVal = document.getElementById("email")?.value.trim() || "";

    const resumeData = {
      resumeName: "My Professional Resume",
      fullName: fullNameVal,
      email: emailVal,
      jobTitle: document.getElementById("jobTitle")?.value.trim() || "",
      phone: phone ? phone.value.trim() : "",
      location: document.getElementById("location")?.value.trim() || "",
      summary: document.getElementById("summary")?.value.trim() || "",
      linkedin: document.getElementById("linkedin")?.value.trim() || "",
      github: document.getElementById("github")?.value.trim() || "",
      portfolio: document.getElementById("portfolio")?.value.trim() || "",

      degree: document.getElementById("degree")?.value.trim() || "",
      institution: document.getElementById("institution")?.value.trim() || "",
      startYear: Number(document.getElementById("startYear")?.value) || null,
      endYear: Number(document.getElementById("endYear")?.value) || null,
      grade: document.getElementById("grade")?.value.trim() || "",

      skills: document.getElementById("skills")?.value.trim() || "",

      projectName: document.getElementById("projectName")?.value.trim() || "",
      technologies: document.getElementById("technologies")?.value.trim() || "",
      projectDescription: document.getElementById("projectDescription")?.value.trim() || "",
      projectGithub: document.getElementById("projectGithub")?.value.trim() || "",
      projectLive: document.getElementById("projectLive")?.value.trim() || "",

      company: document.getElementById("company")?.value.trim() || "",
      experienceTitle: document.getElementById("experienceTitle")?.value.trim() || "",
      experienceStart: document.getElementById("experienceStart")?.value || "",
      experienceEnd: document.getElementById("experienceEnd")?.value || "",
      experienceDescription: document.getElementById("experienceDescription")?.value.trim() || ""
    };

    console.log("Sending Resume Data:", resumeData);

    try {
      saveBtn.disabled = true;
      saveBtn.textContent = "Saving...";

      // 4. Send data to Spring Boot backend API
      const response = await fetch(`http://localhost:8080/api/resumes/save/${currentUser.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData)
      });

      if (response.ok) {
        // Update local storage user flag and name
        currentUser.hasCompletedInfo = true;
        currentUser.fullName = fullNameVal;
        currentUser.email = emailVal;
        localStorage.setItem("user", JSON.stringify(currentUser));

        alert("Information saved successfully! Now select your resume template.");
        // Redirect to templates section as requested
        window.location.href = "templates.html";
      } else {
        const errText = await response.text();
        alert("Failed to save resume: " + errText);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Make sure the Spring Boot backend is running on localhost:8080.");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save & Continue";
    }
  });

  // Quick-Fill Demo Data for Fast Testing
  const fillDemoBtn = document.getElementById("fillDemoBtn");
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener("click", () => {
      document.getElementById("fullName").value = "John Doe";
      document.getElementById("jobTitle").value = "Software Developer";
      document.getElementById("email").value = "john.doe@example.com";
      if (phone) phone.value = "9876543210";
      document.getElementById("location").value = "Mumbai, Maharashtra, India";
      document.getElementById("linkedin").value = "https://linkedin.com/in/johndoe";
      document.getElementById("github").value = "https://github.com/johndoe";
      document.getElementById("portfolio").value = "https://johndoe.dev";
      document.getElementById("summary").value = "Full-stack developer with experience building modern web applications using Java, Spring Boot and JavaScript.";

      document.getElementById("degree").value = "B.Tech in Computer Engineering";
      document.getElementById("institution").value = "XYZ Engineering College";
      document.getElementById("startYear").value = "2024";
      document.getElementById("endYear").value = "2028";
      document.getElementById("grade").value = "8.5 CGPA";

      document.getElementById("skills").value = "Java, Spring Boot, JavaScript, MySQL, HTML, CSS, Git, REST APIs";

      document.getElementById("projectName").value = "ResumeCraft - Full Stack Resume Builder";
      document.getElementById("technologies").value = "Spring Boot, MySQL, JavaScript";
      document.getElementById("projectDescription").value = "A full-stack resume builder that allows users to create, edit, choose templates, and download professional resumes.";
      document.getElementById("projectGithub").value = "https://github.com/johndoe/resumecraft";
      document.getElementById("projectLive").value = "https://resumecraft.live";

      document.getElementById("company").value = "ABC Technologies";
      document.getElementById("experienceTitle").value = "Software Developer Intern";
      document.getElementById("experienceStart").value = "2026-01-01";
      document.getElementById("experienceEnd").value = "2026-06-30";
      document.getElementById("experienceDescription").value = "Developed REST APIs using Spring Boot and worked with MySQL databases to build scalable applications.";

      console.log("Demo data filled!");
    });
  }
});