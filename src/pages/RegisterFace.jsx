import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import toast from 'react-hot-toast';

import api from '../utils/api';

const STEPS = {
  WELCOME: 'welcome',
  INFO: 'info',
  CAPTURE: 'capture',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
};

const guidanceMessages = [
  'Align your face within the frame',
  'Face detected',
  'Hold still',
  'Capturing biometric data',
  'Face captured successfully',
];

function Spinner({ small = false }) {
  return (
    <div
      className={`${small ? 'h-5 w-5 border-2' : 'h-10 w-10 border-[3px]'} rounded-full border-sky-400 border-t-transparent animate-spin`}
    />
  );
}

function ProgressDots({ currentStep }) {
  const steps = [STEPS.WELCOME, STEPS.INFO, STEPS.CAPTURE, STEPS.SUCCESS];

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <span
          key={step}
          className={`h-2.5 rounded-full transition-all ${
            steps.indexOf(currentStep) >= index ? 'w-8 bg-sky-400' : 'w-2.5 bg-slate-600'
          }`}
        />
      ))}
    </div>
  );
}

function Shell({ step, children }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08111f] text-slate-100">
      <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(180deg,_#0b1324_0%,_#08111f_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-[0_30px_120px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-sky-400/20 bg-sky-500/10 text-xl font-bold text-sky-300">
                A
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-bold tracking-tight text-white">Attendix</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">Biometric Onboarding</p>
            </div>
            <ProgressDots currentStep={step} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterFace() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const selectedStudent = location.state?.student;

  const [step, setStep] = useState(STEPS.WELCOME);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [guidance, setGuidance] = useState(guidanceMessages[0]);
  const [completedAt, setCompletedAt] = useState('');
  const [form, setForm] = useState({
    name: selectedStudent?.name || '',
    matric: selectedStudent?.matric || '',
    department: selectedStudent?.department || 'Computer Science',
    level: selectedStudent?.level || '100',
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const guidanceIntervalRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const modelUrl = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
      ]);
      setModelsLoaded(true);
    };

    loadModels().catch((err) => {
      console.error(err);
      setMessage('Failed to load face models. Please retry registration.');
      setStep(STEPS.ERROR);
    });
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 720, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      toast.error('Camera access is required');
      setMessage('Camera permission was not granted. Please allow access and try again.');
      setStep(STEPS.ERROR);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    let timeoutId;

    if (step === STEPS.CAPTURE || step === STEPS.PROCESSING) {
      timeoutId = window.setTimeout(() => {
        startCamera();
      }, 0);
    }

    if (step === STEPS.CAPTURE) {
      let index = 0;
      guidanceIntervalRef.current = window.setInterval(() => {
        index = (index + 1) % guidanceMessages.length;
        setGuidance(guidanceMessages[index]);
      }, 2200);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (guidanceIntervalRef.current) {
        window.clearInterval(guidanceIntervalRef.current);
        guidanceIntervalRef.current = null;
      }
      stopCamera();
    };
  }, [step]);

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    setGuidance(guidanceMessages[0]);
    setStep(STEPS.CAPTURE);
  };

  const handleCapture = async () => {
    if (!modelsLoaded) {
      toast.error('Biometric models still loading');
      return;
    }

    if (!videoRef.current) return;

    setSubmitting(true);
    setGuidance('Capturing biometric data');
    setStep(STEPS.PROCESSING);

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMessage('Face not detected. Please retry capture.');
        setGuidance('Align your face within the frame');
        setStep(STEPS.ERROR);
        return;
      }

      if (token) {
        const descriptor = Array.from(detection.descriptor);
        await api.post('/students/register-face', {
          token,
          face_descriptor: descriptor,
        });
      }

      stopCamera();
      setCompletedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setGuidance('Face captured successfully');
      setStep(STEPS.SUCCESS);
    } catch (err) {
      const msg = err.response?.data?.message || 'Please retry capture';
      setMessage(msg);
      setStep(STEPS.ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setMessage('');
    setGuidance(guidanceMessages[0]);
    setStep(STEPS.CAPTURE);
  };

  if (step === STEPS.WELCOME) {
    return (
      <Shell step={step}>
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Face Registration</h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Register your face once for secure attendance verification.
          </p>
          <div className="mt-6 rounded-[24px] border border-white/10 bg-[#182338] p-5 text-left">
            <p className="text-sm font-semibold text-white">Secure biometric enrollment</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your biometric profile is used only for trusted attendance verification within Attendix and follows institutional identity security standards.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStep(STEPS.INFO)}
            className="mt-8 w-full rounded-2xl bg-sky-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Get Started
          </button>
        </div>
      </Shell>
    );
  }

  if (step === STEPS.INFO) {
    return (
      <Shell step={step}>
        <form onSubmit={handleInfoSubmit} className="mt-8 space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Student Information</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">Confirm your academic details before biometric enrollment.</p>
          </div>

          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Full Name"
            className="w-full rounded-2xl border border-white/10 bg-[#182338] px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400/40"
          />
          <input
            value={form.matric}
            onChange={(e) => setForm((prev) => ({ ...prev, matric: e.target.value }))}
            placeholder="Matric Number"
            className="w-full rounded-2xl border border-white/10 bg-[#182338] px-4 py-4 text-sm uppercase text-white outline-none placeholder:text-slate-500 focus:border-sky-400/40"
          />
          <select
            value={form.department}
            onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-[#182338] px-4 py-4 text-sm text-slate-100 outline-none focus:border-sky-400/40"
          >
            <option>Computer Science</option>
            <option>Information Technology</option>
            <option>Software Engineering</option>
            <option>Mathematics</option>
          </select>
          <select
            value={form.level}
            onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-[#182338] px-4 py-4 text-sm text-slate-100 outline-none focus:border-sky-400/40"
          >
            <option>100</option>
            <option>200</option>
            <option>300</option>
            <option>400</option>
          </select>

          <button
            type="submit"
            className="w-full rounded-2xl bg-sky-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Continue
          </button>
        </form>
      </Shell>
    );
  }

  if (step === STEPS.CAPTURE || step === STEPS.PROCESSING) {
    return (
      <Shell step={step === STEPS.PROCESSING ? STEPS.CAPTURE : step}>
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Face Enrollment</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">{guidance}</p>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[30px] border border-sky-400/15 bg-[#121b2e] p-4 shadow-[0_20px_70px_rgba(59,130,246,0.16)]">
          <div className="relative aspect-square overflow-hidden rounded-[26px] bg-slate-950">
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full scale-x-[-1] object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.16),_transparent_56%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-sky-300/35">
                <div className={`absolute inset-0 rounded-full border-4 border-sky-400/60 ${step === STEPS.PROCESSING ? 'animate-pulse' : ''}`} />
                <div className="absolute inset-3 rounded-full border border-dashed border-sky-300/25" />
                <div className={`absolute inset-0 rounded-full ${step === STEPS.PROCESSING ? 'animate-spin-slow' : ''}`}>
                  <div className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full bg-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.65)]" />
                </div>
                <div className="absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-sky-400/30" />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-sky-400/20" />
            {step === STEPS.PROCESSING ? <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-sky-300/40 shadow-[0_0_25px_rgba(56,189,248,0.55)]" /> : null}

            {!modelsLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
                <div className="text-center">
                  <Spinner />
                  <p className="mt-3 text-sm text-slate-300">Loading biometric models...</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-[#182338] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Realtime Guidance</p>
          <p className="mt-2 text-sm font-medium text-slate-200">{guidance}</p>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={handleCapture}
            disabled={submitting || !modelsLoaded}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-sky-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Spinner small />
                Capturing biometric data
              </>
            ) : (
              'Capture Face'
            )}
          </button>
          <button
            type="button"
            onClick={() => setStep(STEPS.INFO)}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Back
          </button>
        </div>
      </Shell>
    );
  }

  if (step === STEPS.SUCCESS) {
    return (
      <Shell step={step}>
        <div className="mt-8 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.22)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/15 text-3xl text-emerald-300">
              ✓
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">Registration Completed</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">Your biometric identity has been securely registered.</p>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-[#182338] p-5 text-left">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Student Summary</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Full Name</span>
                <span className="font-medium text-white">{form.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Matric Number</span>
                <span className="font-medium text-white">{form.matric.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Department</span>
                <span className="font-medium text-white">{form.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Verified At</span>
                <span className="font-medium text-emerald-300">{completedAt}</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-400">Attendance verification is now enabled for this student profile.</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell step={STEPS.CAPTURE}>
      <div className="mt-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-rose-400/20 bg-rose-500/10 text-4xl text-rose-300">
          !
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">Registration Error</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">{message || 'Please retry capture'}</p>
        <div className="mt-8 grid gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-2xl bg-sky-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Retry Capture
          </button>
          <p className="text-xs leading-5 text-slate-500">If the problem continues, move to better lighting and ensure only one face is visible.</p>
        </div>
      </div>
    </Shell>
  );
}
