"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import { useCamera } from "@/hooks/useCamera";

export default function CaptureScreen() {
  const { dispatch } = useApp();
  const { videoRef, canvasRef, isActive, error, startCamera, capturePhoto } = useCamera();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  function handleCapture() {
    const dataUrl = capturePhoto();
    if (dataUrl) {
      dispatch({ type: "SET_IMAGE", imageDataUrl: dataUrl });
      dispatch({ type: "SET_SCREEN", screen: "analyzing" });
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      dispatch({ type: "SET_IMAGE", imageDataUrl: dataUrl });
      dispatch({ type: "SET_SCREEN", screen: "analyzing" });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="screen items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex flex-col items-center gap-6"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="font-serif text-2xl text-white">Position Your Face</h2>
          <p className="text-xs text-white/50 tracking-widest">
            FACE FORWARD · GOOD LIGHTING · REMOVE GLASSES
          </p>
        </div>

        {/* Viewfinder */}
        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900">
          {isActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />
          )}
          {/* Oval face guide overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="border-2 border-gold/60 rounded-full"
              style={{ width: "65%", height: "80%" }}
            />
          </div>
          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <p className="text-white/60 text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Actions */}
        <div className="w-full space-y-3">
          {isActive && (
            <button className="btn-gold w-full" onClick={handleCapture}>
              Take Photo
            </button>
          )}
          <button
            className="btn-outline-gold w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload from Gallery
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        <button
          className="text-white/30 text-xs"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "landing" })}
        >
          ← Back
        </button>
      </motion.div>
    </div>
  );
}
