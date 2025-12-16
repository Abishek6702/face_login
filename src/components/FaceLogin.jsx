import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceLogin({ onLogin }) {
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [status, setStatus] = useState("Loading models...");

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setStatus("Models loaded. Starting camera...");
      startVideo();
    };
    loadModelsAndStartVideo();

    // Cleanup on unmount
    return () => {
      stopVideo();
    };
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      })
      .catch((err) => setStatus("Camera error: " + err));
  };

  const stopVideo = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleLogin = async () => {
    setStatus("Detecting face...");
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      setStatus("Face detected! Authenticating...");
      stopVideo(); 
      onLogin(Array.from(detection.descriptor));
    } else {
      setStatus("No face detected. Try again.");
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        width="340"
        height="200"
        className="rounded shadow"
      />
      <div className="mt-2">
        <button
          className="w-full cursor-pointer bg-[#5c61f1] text-white p-3 rounded font-semibold shadow-xl mb-4 flex items-center justify-center gap-2"
          onClick={handleLogin}
        >
          Login with Face
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hidden"
          onClick={startVideo}
        >
          Start Camera
        </button>
      </div>
      <div className="mt-2 text-[#5c61f1] hidden">{status}</div>
    </div>
  );
}
