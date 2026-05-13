import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const STEPS = {
  VALIDATING: 'validating',
  ENTER_MATRIC: 'enter_matric',
  FACE_SCAN: 'face_scan',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default function SignAttendance() {
  const { session_id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState(STEPS.VALIDATING);
  const [session, setSession] = useState(null);
  const [matric, setMatric] = useState('');
  const [message, setMessage] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [scanning, setSigning] = useState(false);

  const videoRef = useRef();
  const streamRef = useRef();

  // Step 1: Validate QR token
  useEffect(() => {
    const validate = async () => {
      try {
        const res = await api.get(`/attend/${session_id}/validate?token=${token}`);
        setSession(res.data);
        setStep(STEPS.ENTER_MATRIC);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Invalid QR code');
        setStep(STEPS.ERROR);
      }
    };
    validate();
  }, [session_id, token]);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // serve from public/models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };
    loadModels().catch(console.error);
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error('Could not access camera. Allow camera permission and try again.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
  };

  useEffect(() => {
    if (step === STEPS.FACE_SCAN) {
      startCamera();
    }
    return () => {
      if (step !== STEPS.FACE_SCAN) stopCamera();
    };
  }, [step]);

  const handleMatricSubmit = (e) => {
    e.preventDefault();
    if (!matric.trim()) return;
    setStep(STEPS.FACE_SCAN);
  };

  const handleFaceScan = async () => {
    if (!modelsLoaded) return toast.error('Face models still loading, wait a moment');
    if (!videoRef.current) return;

    setSigning(true);
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast.error('No face detected. Position your face clearly in the frame.');
        setSigning(false);
        return;
      }

      const faceDescriptor = Array.from(detection.descriptor);

      // Sign attendance
      const res = await api.post('/attend/sign', {
        session_id,
        matric_number: matric.trim().toUpperCase(),
        face_descriptor: faceDescriptor,
      });

      stopCamera();
      setMessage(res.data.message);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
      if (err.response?.status === 409) {
        // Already signed
        setMessage(msg);
        setStep(STEPS.SUCCESS);
      }
    } finally {
      setSigning(false);
    }
  };

  // ─── RENDER ───────────────────────────────────────────────

  if (step === STEPS.VALIDATING) {
    return <Screen><Spinner /><p className="text-gray-400 mt-4">Validating QR code...</p></Screen>;
  }

  if (step === STEPS.ERROR) {
    return (
      <Screen>
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-red-400 mb-2">Invalid QR Code</h2>
        <p className="text-gray-400 text-center max-w-xs">{message}</p>
      </Screen>
    );
  }

  if (step === STEPS.SUCCESS) {
    return (
      <Screen>
        <div className="text-7xl mb-4 animate-bounce">✅</div>
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">Attendance Signed!</h2>
        <p className="text-gray-300 text-center max-w-xs">{message}</p>
        <p className="text-gray-500 text-sm mt-4">{session?.course_name}</p>
      </Screen>
    );
  }

  if (step === STEPS.ENTER_MATRIC) {
    return (
      <Screen>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📋</div>
            <h1 className="text-2xl font-bold text-white">{session?.course_name}</h1>
            <p className="text-gray-400 text-sm mt-1">{session?.course_code}</p>
          </div>

          <form onSubmit={handleMatricSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Enter your Matric Number</label>
              <input
                type="text"
                value={matric}
                onChange={e => setMatric(e.target.value)}
                placeholder="e.g. CSC/2021/001"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-emerald-500 text-center uppercase tracking-wider"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!matric.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-4 rounded-xl text-lg transition"
            >
              Continue to Face Scan →
            </button>
          </form>
        </div>
      </Screen>
    );
  }

  if (step === STEPS.FACE_SCAN) {
    return (
      <Screen>
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Face Verification</h1>
            <p className="text-gray-400 text-sm mt-1">Look straight at the camera</p>
          </div>

          {/* Video feed */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-800 mb-6 aspect-square">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]" // mirror effect
            />
            {/* Face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-56 border-4 border-emerald-400/60 rounded-full" />
            </div>
            {!modelsLoaded && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
                <div className="text-center">
                  <Spinner />
                  <p className="text-gray-300 text-sm mt-2">Loading face models...</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleFaceScan}
            disabled={scanning || !modelsLoaded}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-5 rounded-2xl text-lg transition flex items-center justify-center gap-3"
          >
            {scanning ? (
              <><Spinner small /> Verifying...</>
            ) : (
              <> 📸 Sign Attendance</>
            )}
          </button>

          <button
            onClick={() => { stopCamera(); setStep(STEPS.ENTER_MATRIC); }}
            className="w-full text-gray-500 text-sm mt-3 py-2"
          >
            ← Back
          </button>
        </div>
      </Screen>
    );
  }
}

// Layout wrapper
const Screen = ({ children }) => (
  <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
    {children}
  </div>
);

const Spinner = ({ small }) => (
  <div className={`${small ? 'w-5 h-5 border-2' : 'w-10 h-10 border-4'} border-emerald-500 border-t-transparent rounded-full animate-spin`} />
);
