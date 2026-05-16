import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import toast from 'react-hot-toast';

import api from '../utils/api';

const STEPS = {
  VALIDATING: 'validating',
  ENTER_MATRIC: 'enter_matric',
  FACE_SCAN: 'face_scan',
  VERIFYING: 'verifying',
  SUCCESS: 'success',
  ERROR: 'error',
};

function Spinner({ small = false }) {
  return (
    <div
      className={`${small ? 'h-5 w-5 border-2' : 'h-10 w-10 border-[3px]'} rounded-full border-sky-400 border-t-transparent animate-spin`}
    />
  );
}

function StatusBadge({ text, tone = 'default' }) {
  const tones = {
    default: 'border-white/10 bg-white/5 text-slate-300',
    blue: 'border-sky-400/20 bg-sky-500/10 text-sky-300',
    success: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
    error: 'border-rose-400/20 bg-rose-500/10 text-rose-300',
  };

  return <div className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${tones[tone]}`}>{text}</div>;
}

function Shell({ children }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08111f] text-slate-100">
      <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(180deg,_#0b1324_0%,_#08111f_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-[0_30px_120px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignAttendance() {
  const { session_id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [step, setStep] = useState(STEPS.VALIDATING);
  const [session, setSession] = useState(null);
  const [matric, setMatric] = useState('');
  const [message, setMessage] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [signing, setSigning] = useState(false);
  const [verifiedAt, setVerifiedAt] = useState('');
  const [scanHint, setScanHint] = useState('Align your face within the frame');

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await api.get(`/attend/${session_id}/validate?token=${encodeURIComponent(token)}`);
        setSession(res.data);
        setStep(STEPS.ENTER_MATRIC);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Invalid QR code');
        setStep(STEPS.ERROR);
      }
    };

    validate();
  }, [session_id, token]);

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
      toast.error('Failed to load face models');
      setMessage('Biometric verification is unavailable right now.');
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

    if (step === STEPS.FACE_SCAN || step === STEPS.VERIFYING) {
      timeoutId = window.setTimeout(() => {
        startCamera();
      }, 0);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      stopCamera();
    };
  }, [step]);

  const handleMatricSubmit = (e) => {
    e.preventDefault();
    if (!matric.trim()) return;
    setScanHint('Align your face within the frame');
    setStep(STEPS.FACE_SCAN);
  };

  const handleFaceScan = async () => {
    if (!modelsLoaded) {
      toast.error('Face models still loading');
      return;
    }

    if (!videoRef.current) return;

    setSigning(true);
    setScanHint('Verifying identity...');
    setStep(STEPS.VERIFYING);

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setScanHint('Align your face within the frame');
        toast.error('No face detected');
        setStep(STEPS.FACE_SCAN);
        setSigning(false);
        return;
      }

      const faceDescriptor = Array.from(detection.descriptor);

      const res = await api.post('/attend/sign', {
        session_id,
        token,
        matric_number: matric.trim().toUpperCase(),
        face_descriptor: faceDescriptor,
      });

      stopCamera();
      setVerifiedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setMessage(res.data.message || 'Attendance verified successfully');
      setStep(STEPS.SUCCESS);
    } catch (err) {
      const msg = err.response?.data?.message || 'Face mismatch detected';
      toast.error(msg);
      setMessage(msg);

      if (err.response?.status === 409) {
        stopCamera();
        setVerifiedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setStep(STEPS.SUCCESS);
        return;
      }

      stopCamera();
      setStep(STEPS.ERROR);
    } finally {
      setSigning(false);
    }
  };

  const retryVerification = () => {
    setMessage('');
    setScanHint('Align your face within the frame');
    setStep(STEPS.FACE_SCAN);
  };

  if (step === STEPS.VALIDATING) {
    return (
      <Shell>
        <div className="flex flex-col items-center text-center">
          <StatusBadge text="Attendix Secure Check" tone="blue" />
          <div className="mt-8">
            <Spinner />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">Validating Session</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Preparing your attendance verification workspace.</p>
        </div>
      </Shell>
    );
  }

  if (step === STEPS.ERROR) {
    return (
      <Shell>
        <div className="flex flex-col items-center text-center">
          <StatusBadge text="Verification Error" tone="error" />
          <div className="mt-8 flex h-24 w-24 items-center justify-center rounded-full border border-rose-400/20 bg-rose-500/10 text-4xl text-rose-300">
            !
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">Face mismatch detected</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">{message || 'We could not complete biometric verification.'}</p>

          <div className="mt-8 grid w-full gap-3">
            <button
              type="button"
              onClick={retryVerification}
              className="rounded-2xl bg-sky-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Retry Verification
            </button>
            <p className="text-xs leading-5 text-slate-500">If this persists, contact your course representative for support.</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (step === STEPS.SUCCESS) {
    return (
      <Shell>
        <div className="flex flex-col items-center text-center">
          <StatusBadge text="Verification Complete" tone="success" />
          <div className="mt-8 flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.22)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/15 text-3xl text-emerald-300">
              ✓
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">Attendance Confirmed</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">{message || 'Attendance verified successfully'}</p>

          <div className="mt-8 w-full rounded-[24px] border border-white/10 bg-[#182338] p-5 text-left">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Course</p>
            <p className="mt-2 text-lg font-semibold text-white">{session?.course_name}</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Time</p>
                <p className="mt-2 font-semibold text-emerald-300">{verifiedAt}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Matric</p>
                <p className="mt-2 font-semibold text-slate-100">{matric.trim().toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (step === STEPS.ENTER_MATRIC) {
    return (
      <Shell>
        <div className="text-center">
          <StatusBadge text="Session Ready" tone="blue" />
          <h1 className="mt-6 text-3xl font-bold text-white">Student Verification</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Enter your matric number to continue to biometric attendance verification.</p>
        </div>

        <div className="mt-8 rounded-[24px] border border-white/10 bg-[#182338] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Course Session</p>
          <p className="mt-2 text-lg font-semibold text-white">{session?.course_name}</p>
          <p className="mt-1 text-sm text-slate-400">{session?.course_code}</p>
        </div>

        <form onSubmit={handleMatricSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-300">Matric Number</label>
            <input
              type="text"
              value={matric}
              onChange={(e) => setMatric(e.target.value)}
              placeholder="CSC/2021/001"
              className="w-full rounded-2xl border border-white/10 bg-[#182338] px-4 py-4 text-center text-lg font-medium uppercase tracking-[0.16em] text-white outline-none placeholder:text-slate-500 focus:border-sky-400/40"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!matric.trim()}
            className="w-full rounded-2xl bg-sky-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </form>
      </Shell>
    );
  }

  if (step === STEPS.FACE_SCAN || step === STEPS.VERIFYING) {
    return (
      <Shell>
        <div className="text-center">
          <StatusBadge text={step === STEPS.VERIFYING ? 'Verifying Identity' : 'Biometric Scan'} tone="blue" />
          <h1 className="mt-6 text-3xl font-bold text-white">Face Verification</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">{scanHint}</p>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[30px] border border-sky-400/15 bg-[#121b2e] p-4 shadow-[0_20px_70px_rgba(59,130,246,0.16)]">
          <div className="relative aspect-square overflow-hidden rounded-[26px] bg-slate-950">
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full scale-x-[-1] object-cover" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.16),_transparent_56%)]" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-sky-300/35">
                <div className={`absolute inset-0 rounded-full border-4 border-sky-400/60 ${step === STEPS.VERIFYING ? 'animate-pulse' : ''}`} />
                <div className="absolute inset-3 rounded-full border border-dashed border-sky-300/25" />
                <div className={`absolute inset-0 rounded-full ${step === STEPS.VERIFYING ? 'animate-spin-slow' : ''}`}>
                  <div className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full bg-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.65)]" />
                </div>
              </div>
            </div>

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
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Guidance</p>
              <p className="mt-2 text-sm font-medium text-slate-200">{scanHint}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Matric</p>
              <p className="mt-2 text-sm font-semibold text-sky-300">{matric.trim().toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={handleFaceScan}
            disabled={signing || !modelsLoaded}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-sky-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {signing ? (
              <>
                <Spinner small />
                Verifying identity...
              </>
            ) : (
              'Verify Attendance'
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setStep(STEPS.ENTER_MATRIC);
            }}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Back
          </button>
        </div>
      </Shell>
    );
  }

  return null;
}
