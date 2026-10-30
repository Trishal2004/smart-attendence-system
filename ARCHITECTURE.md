# Smart Attendance System: Architecture & Security Overview

## 1. System Overview
The **Smart Attendance System** is an advanced, secure attendance tracking platform designed to eliminate the vulnerabilities of traditional methods, such as manual roll calls and easily spoofed, shareable QR codes. By implementing a stringent multi-factor authentication approach, the system guarantees that the student is physically present in the designated classroom and uniquely identified before marking attendance.

**Problem Addressed:**  
Traditional digital attendance systems often rely on QR codes or single-factor authentication. Students can easily take a photo of a QR code and send it to peers, leading to widespread proxy attendance. This system mitigates that risk entirely by requiring concurrent physical, network, and biometric presence.

## 2. Security Architecture: The Triangulation Strategy
To achieve a highly secure, tamper-proof attendance record, the system utilizes a **Triangulation Strategy**. This strategy relies on an AND-logic decision fusion model across three distinct layers of validation. Attendance is only granted if a request successfully passes all three of the following layers:

1. **GPS Geofencing (Location Validation):**
   - The student's device must report GPS coordinates (`Latitude` and `Longitude`) that fall within a strict **50-meter radius** of the classroom's physical coordinates. 
   - Evaluated using the Haversine trigonometric formula to calculate precise spherical distance.

2. **Network Validation (Proximity & Routed Connection):**
   - The system verifies the request's originating IP address.
   - The request must come from the trusted underlying network infrastructure (i.e., the college Wi-Fi routing masks/IP prefixes), mathematically preventing off-campus proxy submissions via mobile data.

3. **Live Face Recognition (Biometric Identity):**
   - A live facial snapshot is captured via the frontend application.
   - The image is processed through deep learning computer vision models to match 128D geometric face embeddings against the student's baseline profiles stored securely in the database.

## 3. Microservices Breakdown
To ensure high availability, separation of concerns, and optimized compute workflows for heavy tasks (like image processing), the application is built on a microservices architecture.

### A. Core Orchestrator: Spring Boot (Java)
The Spring Boot microservice acts as the primary gateway, database manager, and initial security perimeter.
- **Responsibilities:** 
  - Manages primary Database Connections (PostgreSQL/MySQL) and CRUD operations for Users, Classes, and Attendance records.
  - Exposes RESTful API endpoints for the frontend client (React).
  - Performs the mathematical Haversine derivations for the 50m GPS geofencing (Layer 1).
  - Evaluates request network headers and proxies for College Wi-Fi IP validation (Layer 2).
  - Orchestrates downstream requests to the biometric engine.

### B. Biometric Engine: Flask (Python)
Since Python possesses the industry's leading machine learning and computer vision ecosystem, a dedicated Flask microservice is deployed strictly for biometric processing.
- **Responsibilities:**
  - Receives multipart image streams directly from the Spring Boot orchestrator.
  - Computes the incoming image against stored target encodings using specialized libraries (e.g., `face_recognition`, `dlib`, `OpenCV`).
  - Returns a lightweight synchronous JSON response (Success/Fail boolean) back to the Java service.
  - Offloads heavy CPU/GPU matrix computations from the primary transactional database application.

## 4. Workflow of an Attendance Request
When a student initiates an attendance check, the system executes the following operational lifecycle securely and synchronously:

1. **Client Submission:** The student UI application captures the geocoordinates, identifies the network, prompts the camera for a live facial snapshot, and POSTs the payload (Student ID, Session ID, Coordinates, Image) to the Spring Boot API.
2. **Layer 1 Gate (GPS):** Spring Boot receives the payload and calculates the distance against the target classroom node in the database. If distance > 50 meters, the request is immediately dropped and denied.
3. **Layer 2 Gate (Network):** If GPS validation succeeds, Spring Boot assesses the IP footprint of the request against the expected college router prefixes. If unmatched, the request is denied.
4. **Layer 3 Gate (Biometrics):** If Network validation succeeds, Spring Boot proxies the `studentId` and the `image` payload to the Flask microservice over the internal network.
5. **Face Model Evaluation:** The Flask application parses the image stream, loads the student's baseline model, and compares the face embeddings.
6. **Decision Processing:** Flask returns `{"verified": true}` or `{"verified": false}` to Spring Boot.
7. **Record Confirmation:** If true, Spring Boot persists the attendance confirmation with a secure timestamp to the database and echoes a `<200 OK>` to the student payload.
8. **UI Resolution:** The student interface provides a secure success metric dashboard, confirming the validation layers and finalizing the attendance mark.