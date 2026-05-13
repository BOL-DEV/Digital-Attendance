# 🎓 Attendance System

Digital attendance system for university departments. Replaces paper sign-in sheets with QR code + face verification.

## Roles
- **HOC (Head of Class)** – manages courses, opens sessions, generates & sends reports
- **Lecturer** – views attendance records per course/semester, downloads reports
- **Student** – scans QR + face verify to sign attendance (no login required)

## How It Works
1. HOC opens a session → QR code displays on their phone
2. Students walk up, scan QR with their phone camera
3. Browser opens → enter matric number → face scan → signed ✅
4. HOC sees names appear live on screen
5. Session auto-closes after 1hr 30min (2hr class) or 2hr (3hr class)
6. HOC generates report → sends to lecturer in-app
7. Lecturer views & downloads as PDF or Excel

---

## Setup

### Prerequisites
- Node.js v18+
- MongoDB (local install or MongoDB Atlas)

### 1. Database (MongoDB)
Make sure MongoDB is running, then set `MONGO_URI` in `server/.env`.

### 2. Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env (especially MONGO_URI)
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Face API Models
Download face-api.js models and place in `client/public/models/`:
- `tiny_face_detector_model-weights_manifest.json`
- `face_landmark_68_tiny_model-weights_manifest.json`  
- `face_recognition_model-weights_manifest.json`
- (and their weight files)

Download from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

---

## API Endpoints

### Courses
- `POST /api/courses` – create course (HOC)

### Sessions
- `POST /api/sessions` – create session (HOC)
- `GET /api/sessions/:id` – get session + live attendance
- `GET /api/sessions/:id/qr` – refresh QR code
- `PUT /api/sessions/:id/close` – close session

### Students
- `POST /api/students` – add student (HOC)
- `POST /api/students/register-face` – register student face (public)

### Attendance (public)
- `GET /api/attend/:session_id/validate?token=xxx` – validate QR token
- `POST /api/attend/sign` – sign attendance with face descriptor

---

## Tech Stack
- **Frontend**: React, Tailwind CSS, face-api.js, Socket.io client
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB (Mongoose)
- **QR**: qrcode npm package
- **Realtime**: Socket.io

## Future Upgrades
- WiFi/network check for additional location verification
- Projector/screen QR display when hardware is available
- Mobile app version
- Semester-level analytics dashboard
