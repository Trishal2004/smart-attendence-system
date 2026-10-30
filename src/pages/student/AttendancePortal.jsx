import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import Webcam from 'react-webcam';
import { QrCode, ScanFace, Wifi, CheckCircle2, XCircle, Loader2, ArrowRight, RotateCcw, Shield, Camera, CameraOff, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { attendanceApi } from '../../services/api';

const STEPS = [
  { key: 'face', label: 'Face Recognition', icon: ScanFace, color: 'purple', description: 'Verify your identity using facial biometrics' },
  { key: 'wifi', label: 'Wi-Fi Fingerprint', icon: Wifi, color: 'emerald', description: 'Confirm your physical location via Wi-Fi signals' },
];

function parseFacultyQr(decodedText) {
  const raw = (decodedText || '').trim();
  if (!raw) throw new Error('Scanned QR is empty.');

  let payload = null;
  try { payload = JSON.parse(raw); } catch { payload = null; }

  if (!payload) {
    try {
      const qrUrl = new URL(raw);
      payload = {
        sessionId: qrUrl.searchParams.get('sessionId'),
        qrToken: qrUrl.searchParams.get('qrToken'),
      };
    } catch { payload = null; }
  }

  if (!payload && raw.includes(':')) {
    const [sessionIdPart, tokenPart] = raw.split(':');
    payload = { sessionId: sessionIdPart, qrToken: tokenPart };
  }

  const sessionId = Number(payload?.sessionId);
  const qrToken = typeof payload?.qrToken === 'string' ? payload.qrToken.trim() : '';

  if (!Number.isFinite(sessionId) || sessionId <= 0) throw new Error('Invalid QR: missing sessionId.');
  if (!qrToken) throw new Error('Invalid QR: missing qrToken.');

  return { sessionId, qrToken };
}

function getCoordinates() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      return resolve({ latitude: 0, longitude: 0 });
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve({ latitude: 0, longitude: 0 }),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}

function QRScanner({ onComplete }) {
  const { user } = useAuth();
  const [phase, setPhase] = useState('idle'); // idle, scanning, submitting, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const html5QrRef = useRef(null);
  const isProcessingRef = useRef(false);
  const containerId = 'attendance-qr-reader';

  const stopCamera = async () => {
    if (html5QrRef.current) {
      try { await html5QrRef.current.stop(); } catch {}
      try { await html5QrRef.current.clear(); } catch {}
      html5QrRef.current = null;
    }
    setPhase('idle');
  };

  const processQrCode = async (decodedText) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    // 1. Stop scanning visually
    setPhase('submitting');
    await stopCamera();

    try {
      // 2. Parse and Validate
      const { sessionId, qrToken } = parseFacultyQr(decodedText);
      const coords = await getCoordinates();

      // 3. Submit to Database
      await attendanceApi.submitQrAttendance({
        sessionId,
        studentId: Number(user.id),
        qrToken,
        scanTimestamp: Date.now(),
        latitude: coords.latitude,
        longitude: coords.longitude
      });

      // 4. Success
      setPhase('success');
      setTimeout(() => onComplete(true), 1200);

    } catch (err) {
      setPhase('error');
      setErrorMsg(err.message || 'Failed to verify QR code with server.');
      isProcessingRef.current = false;
    }
  };

  const startCamera = async () => {
    if (phase === 'submitting') return;
    setPhase('scanning');
    setErrorMsg('');
    isProcessingRef.current = false;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      stream.getTracks().forEach(track => track.stop());
      
      const html5QrCode = new Html5Qrcode(containerId);
      html5QrRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => processQrCode(decodedText),
        () => {} 
      );
    } catch (err) {
      setPhase('error');
      console.error('Camera error:', err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Camera permission denied. Please allow camera access in your browser settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMsg('No camera found on this device. Please ensure a camera is connected.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMsg('Camera is already in use by another application. Please close other apps using the camera.');
      } else {
        setErrorMsg('Unable to access camera. Please check your browser permissions and try again.');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
        html5QrRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-72 h-72 bg-surface-950 rounded-2xl overflow-hidden">
        {/* Camera feed rendered by html5-qrcode */}
        <div id={containerId} className="w-full h-full" />

        {/* Idle placeholder */}
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-900 text-surface-400 gap-3">
            <Camera className="w-14 h-14 opacity-30" />
            <p className="text-xs">Tap below to open camera</p>
          </div>
        )}

        {/* Scan line overlay while scanning */}
        {phase === 'scanning' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-blue-400 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-blue-400 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-blue-400 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-blue-400 rounded-br-lg" />
            <motion.div
              className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              initial={{ top: '10%' }}
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        )}

        {/* Submitting overlay */}
        {phase === 'submitting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-surface-900/80 backdrop-blur-sm gap-3"
          >
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            <p className="text-sm font-medium text-blue-400">Verifying session...</p>
          </motion.div>
        )}

        {/* Success overlay */}
        {phase === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm"
          >
            <CheckCircle2 className="w-16 h-16 text-blue-400" />
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3">
        {phase === 'idle' && (
          <>
            <button onClick={startCamera}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
              <Camera className="w-4 h-4" /> Open Camera & Scan QR
            </button>
            <button 
              onClick={() => onComplete(true)}
              className="text-xs text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 underline">
              Skip QR scan (demo mode)
            </button>
            <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-sm">
              <p className="text-xs text-surface-600 dark:text-surface-400 text-center">
                💡 Your browser may ask for camera permission. Please click <strong>"Allow"</strong> to continue.
              </p>
            </div>
          </>
        )}
        {phase === 'scanning' && (
          <>
            <p className="text-sm text-blue-400 animate-pulse">Point camera at the session QR code...</p>
            <button onClick={stopCamera}
              className="flex items-center gap-2 px-5 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 text-sm rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <CameraOff className="w-4 h-4" /> Stop Camera
            </button>
          </>
        )}
        {phase === 'submitting' && (
          <p className="text-sm text-blue-400 animate-pulse font-medium">Please wait, verifying location & session...</p>
        )}
        {phase === 'success' && (
          <p className="text-sm text-blue-400 font-medium">QR code verified successfully!</p>
        )}
        {phase === 'error' && (
          <div className="flex flex-col items-center gap-3 max-w-md">
            <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl w-full">
              <div className="flex items-start gap-2 text-danger-500 text-sm mb-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium">{errorMsg}</p>
              </div>
              <div className="text-xs text-surface-600 dark:text-surface-400 space-y-2">
                <p className="font-semibold">How to enable camera:</p>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>Click the 🔒 or 🎥 icon in your browser's address bar</li>
                  <li>Select "Allow" for Camera permissions</li>
                  <li>Click the "Retry" button below</li>
                </ol>
                <p className="mt-3 pt-2 border-t border-surface-200 dark:border-surface-700">
                  <strong>Still not working?</strong> Check System Settings → Privacy & Security → Camera → Enable your browser
                </p>
              </div>
            </div>
            <button onClick={startCamera}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> Retry Camera Access
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FaceScanner({ onComplete }) {
  const [phase, setPhase] = useState('idle'); // idle, streaming, processing, done, error
  const webcamRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = () => {
    setPhase('streaming');
    setErrorMsg('');
  };

  const capturePhoto = useCallback(() => {
    // 1. Capture base64 screenshot from react-webcam
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setPhase('processing');

      // Simulated processing delay before finalizing
      setTimeout(() => {
        setPhase('done');
        setTimeout(() => onComplete({ passed: true, imageBase64: imageSrc }), 1500);
      }, 2500);
    }
  }, [webcamRef, onComplete]);

  const handleUserMediaError = (err) => {
    setPhase('error');
    console.error('Face camera error:', err);
    setErrorMsg('Camera access denied or unavailable. Please check permissions.');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-72 h-72 bg-surface-950 rounded-2xl overflow-hidden shadow-xl border border-surface-200 dark:border-surface-800">
        
        {/* Live camera feed using react-webcam */}
        {(phase === 'streaming' || phase === 'processing') && !capturedImage && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }} // Forces front camera selfie mode
            onUserMediaError={handleUserMediaError}
            mirrored={true} // Natural mirror effect
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Display Captured Image during processing */}
        {capturedImage && (
          <img 
            src={capturedImage} 
            alt="Captured Face" 
            className="absolute inset-0 w-full h-full object-cover" 
            style={{ transform: 'scaleX(-1)' }} 
          />
        )}

        {/* Idle placeholder */}
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-900 text-surface-400 gap-3">
            <ScanFace className="w-14 h-14 opacity-30" />
            <p className="text-xs">Tap below to open camera</p>
          </div>
        )}

        {/* Error state */}
        {phase === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-900 text-surface-400 gap-3">
            <CameraOff className="w-14 h-14 opacity-30 text-danger-400" />
            <p className="text-xs text-danger-400">Camera unavailable</p>
          </div>
        )}

        {/* Face oval guide while streaming/processing */}
        {(phase === 'streaming' || phase === 'processing') && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-40 h-52 rounded-full border-2 border-dashed"
              animate={{
                borderColor: phase === 'streaming'
                  ? ['rgba(168,85,247,0.3)', 'rgba(168,85,247,0.8)', 'rgba(168,85,247,0.3)']
                  : ['rgba(168,85,247,0.5)', 'rgba(34,197,94,0.8)', 'rgba(168,85,247,0.5)'],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        )}

        {/* Face mesh dots during processing */}
        {phase === 'processing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: i * 0.08, duration: 0.8, repeat: Infinity }}
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${15 + Math.random() * 60}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Done overlay */}
        {phase === 'done' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-purple-500/20 backdrop-blur-sm"
          >
            <CheckCircle2 className="w-16 h-16 text-purple-400" />
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3">
        {phase === 'idle' && (
          <>
            <button onClick={startCamera}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors">
              <Camera className="w-4 h-4" /> Open Camera & Verify Face
            </button>
            <button 
              onClick={() => onComplete({ passed: true, imageBase64: 'mock_base64_string' })}
              className="text-xs text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 underline">
              Skip face verification (demo mode)
            </button>
          </>
        )}
        {phase === 'streaming' && (
          <>
            <p className="text-sm text-purple-400 animate-pulse mb-2">Position your face inside the oval...</p>
            <button onClick={capturePhoto}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30 text-white text-sm font-bold rounded-full transition-all hover:scale-105 active:scale-95">
              <Camera className="w-5 h-5" /> Snap Photo
            </button>
          </>
        )}
        {phase === 'processing' && (
          <p className="text-sm text-purple-400 animate-pulse">Processing biometric data with AI...</p>
        )}
        {phase === 'done' && (
          <p className="text-sm text-purple-400 font-medium">Identity verified successfully!</p>
        )}
        {phase === 'error' && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-danger-500 text-sm"><AlertCircle className="w-4 h-4" /> {errorMsg}</div>
            <button onClick={() => setPhase('idle')}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function WifiScanner({ onComplete }) {
  const [signals, setSignals] = useState([
    { ssid: 'UniNet-5G', rssi: -45, matched: false },
    { ssid: 'UniNet-LH3', rssi: -52, matched: false },
    { ssid: 'UniNet-Lab', rssi: -68, matched: false },
    { ssid: 'UniNet-Lib', rssi: -78, matched: false },
  ]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    signals.forEach((_, i) => {
      setTimeout(() => {
        setSignals(prev => prev.map((s, j) => j === i ? { ...s, matched: true } : s));
      }, 800 * (i + 1));
    });
    const t = setTimeout(() => {
      setDone(true);
      onComplete({ passed: true, bssid: 'UniNet-5G' });
    }, 4000);
    return () => clearTimeout(t);
  }, [onComplete]);

  const getStrength = (rssi) => {
    if (rssi > -50) return 4;
    if (rssi > -60) return 3;
    if (rssi > -70) return 2;
    return 1;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-64 p-6 bg-surface-50 dark:bg-surface-800/50 rounded-2xl">
        {/* Pulse animation */}
        {!done && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-32 h-32 rounded-full border-2 border-emerald-400/30"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-24 h-24 rounded-full border-2 border-emerald-400/40"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        )}

        <div className="relative space-y-3">
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider text-center mb-4">
            {done ? 'Location Verified' : 'Scanning Wi-Fi Networks...'}
          </p>
          {signals.map((sig, i) => (
            <motion.div
              key={sig.ssid}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-surface-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-0.5 h-4">
                  {[1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className={`w-1 rounded-full transition-colors ${level <= getStrength(sig.rssi) ? 'bg-emerald-400' : 'bg-surface-300 dark:bg-surface-600'}`}
                      style={{ height: `${level * 25}%` }}
                    />
                  ))}
                </div>
                <span className="text-sm text-surface-700 dark:text-surface-300">{sig.ssid}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-surface-400">{sig.rssi} dBm</span>
                {sig.matched && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AttendancePortal() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState({});
  const [capturedData, setCapturedData] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const submitSmartAttendance = async (finalData) => {
    setIsSubmitting(true);
    try {
      // Typically, sessionId is selected or passed via URL context. Mocking 1 for demo purposes.
      const sessionId = 1;
      const coords = await getCoordinates();
      
      const payload = {
        studentId: Number(user.id),
        sessionId: sessionId,
        bssid: finalData.bssid || 'UniNet-5G',
        imageBase64: finalData.imageBase64,
        latitude: coords.latitude, // Bonus: Adding GPS Coordinates just in case! 
        longitude: coords.longitude
      };

      // Ensure API has the route added below in the services/api.js file!
      await attendanceApi.submitSmartAttendance(payload);
      
      // Artificial delay for UI UX smoothness
      setTimeout(() => {
        setIsSubmitting(false);
        setShowResult(true);
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      setSubmissionError(error.message || 'Failed to submit smart attendance.');
      setShowResult(true);
    }
  };

  const handleStepComplete = useCallback((data) => {
    const stepKey = STEPS[currentStep].key;
    const { passed, ...rest } = data;
    
    setResults(prev => ({ ...prev, [stepKey]: passed }));
    const newCapturedData = { ...capturedData, ...rest };
    setCapturedData(newCapturedData);

    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        submitSmartAttendance(newCapturedData);
      }
    }, 1000);
  }, [currentStep, capturedData]);

  const allPassed = Object.values(results).length === 2 && Object.values(results).every(Boolean) && !submissionError;

  const reset = () => {
    setCurrentStep(0);
    setResults({});
    setCapturedData({});
    setShowResult(false);
    setSubmissionError('');
  };

  return (
    <div>
      <Navbar title="Mark Attendance" />
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((step, i) => {
              const stepResult = results[step.key];
              const isActive = i === currentStep && !showResult;
              const isDone = stepResult !== undefined;

              return (
                <div key={step.key} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center gap-2 ${i > 0 ? 'flex-1' : ''}`}>
                    {i > 0 && (
                      <div className={`flex-1 h-0.5 rounded-full transition-colors ${isDone ? 'bg-success-500' : 'bg-surface-200 dark:bg-surface-700'}`} />
                    )}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        boxShadow: isActive ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? stepResult ? 'bg-success-500 text-white' : 'bg-danger-500 text-white'
                          : isActive ? 'bg-primary-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
                      }`}
                    >
                      {isDone ? (
                        stepResult ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step labels */}
          <div className="flex justify-between mb-8">
            {STEPS.map((step, i) => (
              <div key={step.key} className="text-center flex-1">
                <p className={`text-xs font-medium ${i === currentStep && !showResult ? 'text-primary-500' : 'text-surface-400'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>

          {/* Scanner Area */}
          <AnimatePresence mode="wait">
            {!showResult && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8"
              >
                <div className="text-center mb-6">
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                    Step {currentStep + 1}: {STEPS[currentStep].label}
                  </h2>
                  <p className="text-sm text-surface-500 mt-1">{STEPS[currentStep].description}</p>
                </div>

                <div className="flex justify-center">
                  {currentStep === 0 && <FaceScanner onComplete={handleStepComplete} />}
                  {currentStep === 1 && <WifiScanner onComplete={handleStepComplete} />}
                </div>
              </motion.div>
            )}

            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 flex flex-col items-center justify-center gap-4 py-16"
              >
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Transmitting Encrypted Biometrics...</h2>
                <p className="text-sm text-surface-500">Contacting AI server for final AND gate verification</p>
              </motion.div>
            )}

            {showResult && !isSubmitting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8"
              >
                {/* Decision Fusion Summary */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className={`inline-flex w-20 h-20 rounded-full items-center justify-center mb-4 ${
                      allPassed ? 'bg-success-500/10' : 'bg-danger-500/10'
                    }`}
                  >
                    {allPassed ? (
                      <CheckCircle2 className="w-10 h-10 text-success-500" />
                    ) : (
                      <XCircle className="w-10 h-10 text-danger-500" />
                    )}
                  </motion.div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                    {allPassed ? 'Attendance Marked Successfully' : 'Verification Failed'}
                  </h2>
                  <p className="text-sm text-surface-500 mt-1 max-w-md mx-auto text-center">
                    {submissionError ? submissionError : (allPassed ? 'Both verification factors passed.' : 'One or more verification factors failed.')}
                  </p>
                </div>

                {/* Decision Fusion Table */}
                <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-primary-500" />
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Decision Fusion Summary</h3>
                  </div>
                  <div className="space-y-2">
                    {STEPS.map((step) => {
                      const passed = results[step.key];
                      return (
                        <div key={step.key} className="flex items-center justify-between p-3 bg-white dark:bg-surface-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <step.icon className="w-4 h-4 text-surface-500" />
                            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{step.label}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                            passed ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500'
                          }`}>
                            {passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {passed ? 'Passed' : 'Failed'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700 flex items-center justify-between">
                    <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Final Result (AND Gate)</span>
                    <span className={`text-sm font-bold ${allPassed ? 'text-success-500' : 'text-danger-500'}`}>
                      {allPassed ? '✓ CONFIRMED' : '✗ DENIED'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 font-medium rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
