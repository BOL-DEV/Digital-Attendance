import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../utils/api';

export default function HocDashboard() {
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseId, setCourseId] = useState('');

  const [studentName, setStudentName] = useState('');
  const [studentMatric, setStudentMatric] = useState('');
  const [selfRegisterUrl, setSelfRegisterUrl] = useState('');

  const [classType, setClassType] = useState('2hr');

  const canCreateCourse = useMemo(() => {
    return courseName.trim().length > 0 && courseCode.trim().length > 0;
  }, [courseName, courseCode]);

  const canAddStudent = useMemo(() => {
    return courseId.trim().length > 0 && studentName.trim().length > 0 && studentMatric.trim().length > 0;
  }, [courseId, studentName, studentMatric]);

  const canStartSession = useMemo(() => {
    return courseId.trim().length > 0 && (classType === '2hr' || classType === '3hr');
  }, [courseId, classType]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!canCreateCourse) return;

    try {
      const res = await api.post('/courses', {
        name: courseName.trim(),
        code: courseCode.trim().toUpperCase(),
      });
      const created = res.data.course;
      setCourseId(created._id);
      toast.success('Course created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!canAddStudent) return;

    try {
      const res = await api.post('/students', {
        name: studentName.trim(),
        matric_number: studentMatric.trim().toUpperCase(),
        course_id: courseId,
      });

      setSelfRegisterUrl(res.data.selfRegisterUrl);
      toast.success('Student added. Share the link');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student');
    }
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    if (!canStartSession) return;

    try {
      const res = await api.post('/sessions', {
        course_id: courseId,
        class_type: classType,
      });

      const sessionId = res.data.session?._id;
      if (!sessionId) {
        toast.error('Session created but missing id');
        return;
      }

      toast.success('Session started');
      navigate(`/hoc/session/${sessionId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start session');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(selfRegisterUrl);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">HOC Dashboard (MVP)</h1>
          <p className="text-gray-400">Create a course, add students, start a session.</p>
        </header>

        <section className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">1) Create Course</h2>
          <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Course name (e.g. Data Structures)"
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
            />
            <input
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Course code (e.g. CSC301)"
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 uppercase"
            />
            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={!canCreateCourse}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-5 py-3 rounded-xl font-semibold"
              >
                Create Course
              </button>
              {courseId ? (
                <span className="text-sm text-gray-400">Course ID: <span className="text-gray-200">{courseId}</span></span>
              ) : null}
            </div>
          </form>
        </section>

        <section className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">2) Add Student (Self Face-Registration Link)</h2>
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="Course ID (paste here)"
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
            />
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Student name"
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
            />
            <input
              value={studentMatric}
              onChange={(e) => setStudentMatric(e.target.value)}
              placeholder="Matric number (e.g. CSC/2021/001)"
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 uppercase md:col-span-2"
            />
            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={!canAddStudent}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-5 py-3 rounded-xl font-semibold"
              >
                Add Student
              </button>
              {selfRegisterUrl ? (
                <button
                  type="button"
                  onClick={copyLink}
                  className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-xl"
                >
                  Copy Link
                </button>
              ) : null}
            </div>

            {selfRegisterUrl ? (
              <div className="md:col-span-2 mt-2">
                <p className="text-sm text-gray-400 mb-2">Share this with the student:</p>
                <a className="text-emerald-400 break-all" href={selfRegisterUrl} target="_blank" rel="noreferrer">
                  {selfRegisterUrl}
                </a>
              </div>
            ) : null}
          </form>
        </section>

        <section className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">3) Start Session (QR + Live Attendance)</h2>
          <form onSubmit={handleStartSession} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="Course ID"
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 md:col-span-2"
            />
            <select
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
            >
              <option value="2hr">2hr (90 mins)</option>
              <option value="3hr">3hr (120 mins)</option>
            </select>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={!canStartSession}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-5 py-3 rounded-xl font-semibold"
              >
                Start Session
              </button>
            </div>
          </form>
        </section>

        <section className="text-sm text-gray-500">
          Face models must be in <span className="text-gray-300">client/public/models</span> for face scan pages.
        </section>
      </div>
    </div>
  );
}
