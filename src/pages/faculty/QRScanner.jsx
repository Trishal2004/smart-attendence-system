import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, CheckCircle2, Loader2, MapPin, ScanLine, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { attendanceApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SCANNER_ELEMENT_ID = 'student-qr-reader';

function parseFacultyQr(decodedText) {
  const raw = (decodedText || '').trim();
  if (!raw) {
    throw new Error('Scanned QR is empty.');
  }

  let payload = null;

  try {
    payload = JSON.parse(raw);
  } catch {
    payload = null;
  }

  if (!payload) {
    try {
      const qrUrl = new URL(raw);
      payload = {
        sessionId: qrUrl.searchParams.get('sessionId'),
        qrToken: qrUrl.searchParams.get('qrToken'),
      };
    } catch {
      payload = null;
    }
  }

  // Fallback format: sessionId:qrToken
  if (!payload && raw.includes(':')) {
    const [sessionIdPart, tokenPart] = raw.split(':');
    payload = { sessionId: sessionIdPart, qrToken: tokenPart };
  }

  const sessionId = Number(payload?.sessionId);
  const qrToken = typeof payload?.qrToken === 'string' ? payload.qrToken.trim() : '';

  if (!Number.isFinite(sessionId) || sessionId <= 0) {
    throw new Error('Invalid QR: missing sessionId.');
  }

  if (!qrToken) {
    throw new Error('Invalid QR: missing qrToken.');
  }

  return { sessionId, qrToken };
}

function getCoordinates() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: 0, longitude: 0 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve({ latitude: 0, longitude: 0 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  });
}

export default function QRScanner() {
  const { user } = useAuth();

  const scannerRef = useRef(null);
  const hasProcessedRef = useRef(false);

  const [isScanning, setIsScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      setIsScanning(false);
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch {
      // Ignore stop errors when scanner is already stopped.
    }

    try {
      await scanner.clear();
    } catch {
      // Ignore clear errors.
    }

    scannerRef.current = null;
    setIsScanning(false);
  }, []);

  const submitAttendanceFromQr = useCallback(
    async (decodedText) => {
      if (!user?.id) {
        setError('Student account not found. Please login again.');
        return;
      }

      try {
        setSubmitting(true);
        setError('');
        setSuccessMessage('');

        const { sessionId, qrToken } = parseFacultyQr(decodedText);
        const { latitude, longitude } = await getCoordinates();

        const payload = {
          sessionId,
          studentId: Number(user.id),
          qrToken,
          scanTimestamp: Date.now(),
          latitude,
          longitude,
        };

        const response = await attendanceApi.submitQrAttendance(payload);

        setLastScan({
          sessionId,
          qrToken,
          scanTimestamp: payload.scanTimestamp,
        });
        setSuccessMessage(response?.message || 'Attendance submitted successfully.');
      } catch (apiError) {
        setError(apiError.message || 'Failed to submit attendance.');
      } finally {
        setSubmitting(false);
      }
    },
    [user?.id]
  );

  const startScanner = useCallback(async () => {
    if (isScanning || submitting) {
      return;
    }

    setError('');
    setSuccessMessage('');
    hasProcessedRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      stream.getTracks().forEach((track) => track.stop());

      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1,
        },
        async (decodedText) => {
          if (hasProcessedRef.current) {
            return;
          }
          hasProcessedRef.current = true;

          await stopScanner();
          await submitAttendanceFromQr(decodedText);
        },
        () => {
          // Ignore decode misses while scanning.
        }
      );

      setIsScanning(true);
    } catch (cameraError) {
      if (cameraError?.name === 'NotAllowedError' || cameraError?.name === 'PermissionDeniedError') {
        setError('Camera access denied. Please allow camera permission and try again.');
      } else if (cameraError?.name === 'NotFoundError' || cameraError?.name === 'DevicesNotFoundError') {
        setError('No camera found on this device.');
      } else if (cameraError?.name === 'NotReadableError' || cameraError?.name === 'TrackStartError') {
        setError('Camera is busy in another app. Please close it and retry.');
      } else {
        setError('Unable to start camera scanner. Please try again.');
      }

      await stopScanner();
    }
  }, [isScanning, stopScanner, submitAttendanceFromQr, submitting]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div>
      <Navbar title="Student QR Scanner" />

      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-800 flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-primary-500" />
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Scan Faculty Session QR</h3>
          </div>

          <div className="p-5 space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-surface-950 aspect-square max-w-md mx-auto">
              <div id={SCANNER_ELEMENT_ID} className="w-full h-full" />

              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-surface-400">
                  <ScanLine className="w-14 h-14 mb-3 opacity-40" />
                  <p className="text-sm">Camera preview appears here</p>
                </div>
              )}

              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    animate={{ y: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-0.5 bg-primary-500 shadow-[0_0_8px_2px_rgba(99,102,241,0.45)]"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3">
              {!isScanning ? (
                <button
                  onClick={startScanner}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  Open Camera
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="flex items-center gap-2 px-5 py-2.5 bg-danger-500 hover:bg-danger-500/90 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <CameraOff className="w-4 h-4" />
                  Stop Camera
                </button>
              )}
            </div>

            {submitting && (
              <div className="rounded-xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm text-primary-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting attendance...
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-success-500/30 bg-success-500/10 px-4 py-3 text-sm text-success-500 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-medium">Attendance Marked</p>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-500 flex items-start gap-2">
                <XCircle className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-medium">Unable to mark attendance</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {lastScan && (
              <div className="rounded-xl border border-surface-200 dark:border-surface-700 px-4 py-3 text-sm text-surface-600 dark:text-surface-300">
                <p className="font-medium text-surface-800 dark:text-surface-100 mb-2">Last Scanned Session</p>
                <div className="space-y-1">
                  <p>Session ID: {lastScan.sessionId}</p>
                  <p>Token: {lastScan.qrToken.slice(0, 12)}...</p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Location captured at submit time
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
