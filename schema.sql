-- ATTENDANCE SYSTEM DATABASE SCHEMA

-- Users table (HOC and Lecturers)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('hoc', 'lecturer')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  lecturer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  hoc_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  matric_number VARCHAR(100) UNIQUE NOT NULL,
  face_descriptor JSONB, -- stores face-api.js descriptor array
  face_registered BOOLEAN DEFAULT FALSE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  hoc_id UUID REFERENCES users(id),
  class_type VARCHAR(10) NOT NULL CHECK (class_type IN ('2hr', '3hr')),
  -- 2hr class = session lasts 1hr 30min, 3hr class = session lasts 2hr
  duration_minutes INTEGER NOT NULL, -- 90 or 120
  qr_token VARCHAR(255) UNIQUE NOT NULL, -- current valid QR token
  qr_expires_at TIMESTAMP NOT NULL, -- QR refreshes every 45 seconds
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  closes_at TIMESTAMP NOT NULL, -- auto close time
  closed_at TIMESTAMP -- actual close time
);

-- Attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  signed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, student_id) -- one sign per student per session
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  generated_by UUID REFERENCES users(id), -- HOC
  sent_to UUID REFERENCES users(id),      -- Lecturer
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_sessions_course ON sessions(course_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_students_course ON students(course_id);
CREATE INDEX idx_students_matric ON students(matric_number);
