import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { LuSmile } from "react-icons/lu";
import { FiCamera } from "react-icons/fi";

export default function FaceRegister({ descriptors, setDescriptors }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Loading models...");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setStatus("Models loaded. Starting camera...");
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }
  }, [modelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setStatus("Camera started. Capture your face.");
      })
      .catch((err) => setStatus("Camera error: " + err));
  };

  const handleCapture = async () => {
    setStatus("Detecting face...");
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
    
      setDescriptors([Array.from(detection.descriptor)]);
      setStatus("Face captured!");

     
      const canvas = canvasRef.current;
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      setCapturedImage(canvas.toDataURL("image/png"));
    } else {
      setStatus("No face detected. Try again.");
    }
  };

  const handleRetake = () => {
    setDescriptors([]);
    setCapturedImage(null);
    setStatus("Camera started. Capture your face.");
    startVideo();
  };

  return (
    <div className="m-auto text-center ">
      <h3 className="font-semibold mb-2 flex items-center gap-2 justify-center">
        <LuSmile className="text-xl" /> Register your face
      </h3>
      <div className="flex justify-center mt-2 mb-2 ">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured face"
            className="rounded shadow w-[320px] h-[240px] object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            width="320"
            height="240"
            className="rounded-lg shadow"
          />
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
      <div className="flex items-center justify-center gap-3 mt-2">
        {capturedImage ? (
          <button
            type="button"
            className="p-2 rounded flex items-center gap-1 bg-green-600 text-white cursor-pointer"
            onClick={handleRetake}
            title="Retake"
          >
            <FiCamera className="w-5 h-5" /> Retake
          </button>
        ) : (
          <button
            type="button"
            className="p-2 rounded flex items-center gap-1  bg-green-600 text-white cursor-pointer "
            onClick={handleCapture}
            disabled={!modelsLoaded}
            title="Capture Face"
          >
            <FiCamera className="w-5 h-5" /> Capture
          </button>
        )}
        
      </div>
      <div className="mt-2 text-white">{status}</div>
    </div>
  );
}
