<div align="center">

# 🌱 CropAdvisor

### Crop Disease Reporting & Agricultural Advisory Management System

**A Spring Boot–powered platform for connecting farmers with agricultural officers, organizing crop-related reports, and tracking advisory actions through a centralized web interface.**

![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-Backend-6DB33F?logo=springboot&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white) ![HTML](https://img.shields.io/badge/HTML5-Frontend-E34F26?logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-Styling-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?logo=javascript&logoColor=black)

**[Overview](#-overview) · [Architecture](#-system-architecture) · [Features](#-core-modules) · [Workflow](#-how-it-works) · [Setup](#-getting-started) · [Roadmap](#-future-enhancements)**

</div>

---

## 📌 Overview

CropAdvisor is a web-based crop problem reporting and agricultural advisory system designed to make communication between farmers and agricultural officers more organized and traceable. Instead of relying on scattered messages or informal follow-ups, the platform maintains structured records of farmers, agricultural regions, officers, crop problems, recommendations, and associated photo references.

A farmer's crop issue is represented as a **ticket**. Each ticket can be associated with a farmer, an agricultural officer, crop symptoms, a status, an advisory recommendation, and supporting photo records. The web interface communicates with a Java Spring Boot REST API, which manages application logic and stores records in MySQL.

> **Project scope:** The current application provides a shared management interface and REST-backed data management. Dedicated authentication, automated officer assignment, scheduled escalation, notifications, and physical image uploads are potential enhancements; they should not be assumed to be implemented.

## 🎯 Problem Statement

Crop problems often require timely guidance, yet reports may be difficult to organize when farmer information, symptom descriptions, officer assignments, and recommendations are maintained separately. Without a centralized record, tracking the progress of an issue or reviewing previous advice can become cumbersome.

**CropAdvisor addresses this organizational gap** by connecting agricultural regions, farmers, officers, crop-problem tickets, and photo references in one database-backed application. Its goal is to support clearer reporting, consistent recordkeeping, and easier follow-up.

## ✨ Project Objectives

- Centralize agricultural region, farmer, and officer information.
- Record crop problems with symptoms and relevant farmer details.
- Associate tickets with agricultural officers and advisory recommendations.
- Track ticket status and store escalation indicators where available.
- Associate image URLs with tickets for additional context.
- Provide a responsive interface that reads and writes real backend data.

## 🏗️ System Architecture

<img width="1008" height="920" alt="image" src="https://github.com/user-attachments/assets/5cbd3d46-3f3c-405f-a24d-3d4e7127e5a1" />

*Figure: CropAdvisor's layered architecture, showing the web interface, Spring Boot application layers, five domain entities, and MySQL database.*

CropAdvisor uses a **layered architecture** to separate presentation, request handling, application logic, and database access. This makes the system easier to understand, test, and extend.

| Layer | Technology / Components | Responsibility |
|---|---|---|
| Users | Farmer, agricultural officer, administrator | Interact with crop reporting and management workflows; these are conceptual roles until authentication is implemented. |
| Frontend | HTML, CSS, JavaScript | Displays forms, dashboards, tables, and ticket details; sends HTTP requests using `fetch()`. |
| REST API | Spring Boot controllers | Receives requests and returns application data, typically as JSON. |
| Business logic | Service interfaces and implementations | Handles existing create, read, update, and other supported operations. |
| Persistence | Spring Data JPA / Hibernate repositories | Maps Java entities to relational records and performs database operations. |
| Database | MySQL | Persists regions, farmers, officers, tickets, and photo references. |

### Architecture explained in five steps

1. **User interaction:** A user opens the CropAdvisor web interface and enters information, such as a crop name and symptoms.
2. **API request:** JavaScript sends an HTTP request containing the relevant JSON payload to the matching Spring Boot controller.
3. **Application processing:** The controller delegates the operation to its service, which performs the logic supported by the existing backend.
4. **Database persistence:** The repository uses JPA/Hibernate to read or write the corresponding MySQL records.
5. **Response and refresh:** The backend returns a response; the frontend displays the result and reloads relevant data so the interface reflects persisted records.

**Example data flow:** `Ticket form → JavaScript fetch() → TicketController → TicketService → TicketRepo → MySQL → JSON response → Updated ticket table`.

## 🧩 Core Modules

| Module | Purpose | Key information |
|---|---|---|
| **Region** | Organizes geographic service areas. | Region name, district, state, PIN code. |
| **Farmer** | Stores farmer profiles and their associated regions. | Name, contact details, address, region. |
| **Officer** | Maintains agricultural officer profiles. | Name, contact details, specialization, region, active status. |
| **Ticket** | Records crop problems and advisory progress. | Farmer, officer, crop, symptoms, status, recommendation, timestamps, escalation flag. |
| **Photo** | Associates supporting photo references with tickets. | Ticket, image URL, upload timestamp. |

### Data relationships

```text
Region ──< Farmer ──< Ticket >── Officer >── Region
                           │
                           └──< Photo
```

- One **region** can be associated with multiple farmers and officers.
- One **farmer** can submit multiple tickets.
- One **officer** can be associated with multiple tickets.
- One **ticket** can have multiple photo records.

These relationships link a reported problem to the people, location, advice, and supporting evidence associated with it.

## 🖥️ Web Interface

The frontend is implemented using **HTML, CSS, and vanilla JavaScript** and is served from Spring Boot's static resources directory.

```text
src/main/resources/static/
├── index.html
├── index.css
└── index.js
```

The interface is organized around a dashboard and management views for regions, farmers, officers, crop-problem tickets, photos, and an administrative overview. Forms and tables are designed to interact with the existing REST endpoints rather than using hardcoded demonstration records.

### Ticket management

The ticket workflow brings together the application's central entities. A ticket can contain a crop name, symptoms, farmer and officer references, its current status, a recommendation, and relevant dates. The interface can display these details and invoke existing backend operations for supported updates.

### Photo references

Photo records associate an image URL with a ticket. **A stored photo URL is not the same as uploading an image file**: actual multipart upload and image storage require additional backend support.

## 🔄 How It Works

1. **Register a region** to identify an agricultural service area.
2. **Register a farmer** and associate the farmer with a region.
3. **Register an officer** and associate the officer with a region.
4. **Create a crop-problem ticket** with the farmer, crop name, symptoms, and any supported officer assignment.
5. **Attach photo references** to provide visual context for the reported issue.
6. **Record an advisory recommendation** and update the ticket status using the existing backend operation.
7. **Review the ticket history and current information** through the management interface.

Ticket records may use statuses such as `OPEN` and `RESOLVED`; the exact supported values and transitions are determined by the current backend implementation. An escalation flag can be stored and displayed, but **automatic time-based escalation requires a separate implemented scheduling mechanism**.

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Programming language | Java 21 |
| Backend framework | Spring Boot |
| REST communication | HTTP + JSON |
| Persistence | Spring Data JPA and Hibernate |
| Database | MySQL |
| Frontend | HTML5, CSS3, vanilla JavaScript |
| API testing | Postman |
| Build and dependency management | Maven / Maven Wrapper |
| Development environment | VS Code |

## 📁 Project Structure

The following shows the **logical application structure**. The repository may contain an additional outer `cropadvisor/` directory depending on how it was checked out.

```text
cropadvisor/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── src/
    ├── main/
    │   ├── java/com/example/cropadvisor/
    │   │   ├── CropadvisorApplication.java
    │   │   ├── controller/
    │   │   ├── model/
    │   │   ├── repository/
    │   │   └── service/
    │   └── resources/
    │       ├── application.properties
    │       └── static/
    │           ├── index.html
    │           ├── index.css
    │           └── index.js
    └── test/
```

Each domain module follows the same general separation: **Model → Repository → Service → Controller**, with the frontend consuming controller endpoints.

## 🚀 Getting Started

### Prerequisites

- JDK 21
- MySQL Server
- Git
- A modern web browser
- Maven, or the Maven Wrapper included in the project

### 1. Clone the repository

```bash
git clone https://github.com/Kavinesh2008/CropAdvisor_API.git
cd CropAdvisor_API
```

Locate the directory containing `pom.xml`. If the repository has a nested `cropadvisor` folder, enter it before running Maven commands.

### 2. Configure MySQL

Create a local database using the name expected by your application configuration. Set the JDBC URL, username, and password in your **local** `src/main/resources/application.properties`, or use environment variables if supported by your configuration.

**Never commit real database passwords, API keys, or private credentials.** Consult the existing project configuration for its actual database name and schema-management settings; do not assume a particular database name or automatically enable destructive schema operations.

### 3. Start the backend

On Windows PowerShell, from the directory containing `mvnw.cmd`:

```powershell
.\mvnw.cmd spring-boot:run
```

On macOS/Linux, if the wrapper is present:

```bash
./mvnw spring-boot:run
```

Alternatively, use `mvn spring-boot:run` if Maven is installed and configured.

### 4. Open the web interface

When Spring Boot starts successfully on its configured port (commonly `8080`), open:

```text
http://localhost:8080/
```

If the root URL is not mapped to the static page in your configuration, try `http://localhost:8080/index.html`.

### 5. Test the API

Use Postman or the frontend to verify the operations exposed by the actual controller mappings. A useful test sequence is **Region → Farmer → Officer → Ticket → Photo**, because later records reference earlier ones.

> **API note:** Controller paths and HTTP methods are defined by the Java source. Inspect those mappings before issuing requests; do not assume that endpoint names or capitalization are uniform.

## 🧪 Testing and Data Integrity

- Verify that the frontend reads existing database records rather than showing hardcoded data.
- Confirm that create and update requests return successful HTTP responses **and** remain visible after reloading.
- Validate farmer, officer, and ticket references against existing database IDs.
- Preserve creation timestamps when updating records; update modification timestamps only as supported by the backend.
- Check null fields, invalid inputs, empty tables, and network errors.
- Test photo URL handling separately from actual image-file uploading.

A successful frontend notification alone does not prove persistence; re-fetch the record or inspect MySQL when verifying a change.

## 🔐 Current Scope and Future Enhancements

The current project focuses on **REST-backed agricultural data management and ticket tracking**. The following are potential extensions, not claims about existing functionality:

- **Secure role-based authentication:** Distinct authorized experiences for farmers, officers, and administrators.
- **Automated officer assignment:** Route tickets to appropriate officers using region and availability rules.
- **Time-based escalation:** Detect unresolved tickets after a configurable period and notify the relevant administrator.
- **Notifications:** Inform farmers and officers when tickets are created, assigned, updated, or resolved.
- **Image uploads:** Accept and securely store actual image files rather than only photo URLs.
- **Analytics:** Explore ticket trends by crop, region, issue type, status, and resolution time.
- **Mobile-first experience:** Improve access for farmers using smartphones and lower-bandwidth connections.

## 🌍 Potential Impact

CropAdvisor demonstrates how a conventional layered web application can support a practical agricultural workflow. By connecting crop reports with farmer profiles, officer details, advisory records, and supporting photos, the system provides a foundation for more organized case management and future decision-support capabilities.

Its immediate contribution is **structured reporting and traceability**; it does not independently diagnose crop diseases or guarantee agricultural outcomes.

## 👨‍💻 Author

**Kavinesh M**  
Computer Science and Engineering  
Sri Eshwar College of Engineering

[GitHub](https://github.com/Kavinesh2008) · [LinkedIn](https://www.linkedin.com/in/kavinesh-m-593ab7380/)

---

<div align="center">

**CropAdvisor — Connecting crop problems with organized agricultural advice.** 🌱

</div>
