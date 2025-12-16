import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgVideo from "../assets/bg-video.mp4";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URI}/api/auth/send-otp`, { email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to send OTP.");
    }
    setLoading(false);
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URI}/api/auth/verify-otp`, {
        email,
        otp,
      });
      toast.success("OTP verified! Set your new password.");
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Invalid OTP.");
    }
    setLoading(false);
  };

  // 3. Change Password (now includes OTP!)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URI}/api/auth/reset-password`, {
        email,
        newPassword,
        otp, // <-- Make sure to send OTP here!
      });
      toast.success("Password changed successfully!");
      setTimeout(() => {
        window.location.href = "/"; // Redirect to login
      }, 2000);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center ">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="fixed inset-0 tint1 z-10"></div>
      <div className=" z-20 w-full flex  rounded-3xl overflow-hidden">
        {/* Glassy Form */}
        <div className=" w-[90%] m-auto lg:w-[30%] lg:ml-30 rounded-3xl overflow-hidden glass p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">
            Forgot Password
          </h2>
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <label className="block text-white text-sm mb-2">
                Enter your email address
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 rounded bg-[#f8f9fa] text-gray-900 border border-gray-300 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full bg-[#5c61f1] text-white p-3 rounded font-semibold shadow-xl"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <label className="block text-white text-sm mb-2">
                Enter the OTP sent to your email
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded bg-[#f8f9fa] text-gray-900 border border-gray-300 focus:outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full bg-[#5c61f1] text-white p-3 rounded font-semibold shadow-xl"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <label className="block text-white text-sm mb-2">
                Set your new password
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 rounded bg-[#f8f9fa] text-gray-900 border border-gray-300 focus:outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full bg-[#5c61f1] text-white p-3 rounded font-semibold shadow-xl"
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <a href="/" className="text-sm text-white underline">
              Back to Login
            </a>
          </div>
        </div>
        <div className="w-[45%]  m-auto flex flex-col justify-center items-center text-white text-center p-8 space-y-4 hidden lg:block">
          <div className="text-3xl font-semibold">
            Stay connected with us by logging in with your personal details.
          </div>
          <p className="text-base font-normal">
            Log in now using your personal details to enjoy
            <br />
            seamless connectivity and personalized experiences.
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
