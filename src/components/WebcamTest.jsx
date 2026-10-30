import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, CheckCircle } from 'lucide-react';

export default function WebcamTest() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    // Captures the current frame as a base64 encoded JPEG
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  const submitPhoto = () => {
    // In the future, this is where you'll send `imgSrc` to your Flask Backend 
    console.log("Photo ready to be sent to Flask API for verification!");
    alert("Photo captured and ready for API submission!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800">
      <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">Face Recognition Scan</h2>
      
      {imgSrc ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="relative rounded-2xl overflow-hidden border-4 border-emerald-500 shadow-xl mb-6">
            <img src={imgSrc} alt="Captured Student Face" className="w-[400px] h-[300px] object-cover" />
            <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={retake} 
              className="flex items-center gap-2 px-5 py-2.5 bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-white rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Retake
            </button>
            <button 
              onClick={submitPhoto} 
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-md"
            >
              <CheckCircle className="w-4 h-4" /> Verify Face
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-surface-200 dark:border-surface-700 mb-6 bg-black">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }} // "user" forces front camera on mobile
              className="w-[400px] h-[300px] object-cover"
              mirrored={true} // Mirrors the camera so it behaves like a sensible selfie cam
            />
          </div>
          <button 
            onClick={capture} 
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-md"
          >
            <Camera className="w-5 h-5" /> Capture Photo
          </button>
        </div>
      )}
    </div>
  );
}