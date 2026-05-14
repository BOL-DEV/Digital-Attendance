import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import toast from 'react-hot-toast';

import api from '../utils/api';

const STEPS = {
  LOADING: 'loading',
  READY: 'ready',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default function RegisterFace() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [step, setStep] = useState(STEPS.LOADING);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setMessage('Missing token in link');
      setStep(STEPS.ERROR);
      return;
    }

    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
      setStep(STEPS.READY);
    };

    loadModels().catch((err) => {
      console.error(err);
      setMessage('Failed to load face models. Put them in client/public/models');
      setStep(STEPS.ERROR);
    });
  }, [token]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      toast.error('Could not access camera. Allow permission and try again.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (step === STEPS.READY) startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const register = async () => {
    if (!modelsLoaded) return toast.error('Models still loading');
    if (!videoRef.current) return;

    setSubmitting(true);
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast.error('No face detected. Try again.');
        setSubmitting(false);
        return;
      }

      const descriptor = Array.from(detection.descriptor);

      const res = await api.post('/students/register-face', {
        token,
        face_descriptor: descriptor,
      });

      stopCamera();
      setMessage(res.data.message || 'Face registered successfully');
      setStep(STEPS.SUCCESS);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setMessage(msg);
      setStep(STEPS.ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === STEPS.LOADING) {
    return (
      <Screen>
        <Spinner />
        <p className="text-gray-400 mt-4">Preparing face registration...</p>
      </Screen>
    );
  }

  if (step === STEPS.ERROR) {
    return (
      <Screen>
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-red-400 mb-2">Registration Failed</h2>
        <p className="text-gray-400 text-center max-w-xs">{message}</p>
      </Screen>
    );
  }

  if (step === STEPS.SUCCESS) {
    return (
      <Screen>
        <div className="text-7xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">Face Registered</h2>
        <p className="text-gray-300 text-center max-w-xs">{message}</p>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Register Your Face</h1>
          <p className="text-gray-400 text-sm mt-1">Look straight at the camera</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-gray-800 mb-6 aspect-square">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-56 border-4 border-emerald-400/60 rounded-full" />
          </div>
        </div>

        <button
          onClick={register}
          disabled={submitting || !modelsLoaded}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-5 rounded-2xl text-lg transition flex items-center justify-center gap-3"
        >
          {submitting ? (
            <>
              <Spinner small /> Registering...
            </>
          ) : (
            <>📸 Register Face</>
          )}
        </button>

        <p className="text-gray-500 text-xs mt-4 text-center">Token: {token.slice(0, 6)}…</p>
      </div>
    </Screen>
  );
}

const Screen = ({ children }) => (
  <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">{children}</div>
);

const Spinner = ({ small }) => (
  <div
    className={`${small ? 'w-5 h-5 border-2' : 'w-10 h-10 border-4'} border-emerald-500 border-t-transparent rounded-full animate-spin`}
  />
);
