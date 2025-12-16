import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgVideo from "../assets/bg-video.mp4";
import FaceRegister from "../components/FaceRegister";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [descriptors, setDescriptors] = useState([]);
  const [message, setMessage] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage("Please enter name, email and password.");
      return;
    }
    setMessage("");
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleFinishRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    if (descriptors.length === 0) {
      setMessage("Please capture at least one face.");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URI}/api/auth/register`, {
        name,
        email,
        password,
        descriptors,
      });
      toast.success("SignUp successful!");
      setTimeout(() => navigate("/"), 1500);
      setDescriptors([]);
      navigate("/");
    } catch (err) {
      setMessage(
        err?.response?.data?.error || "Signup failed. Try another email."
      );
    }
  };

  const Stepper = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 1 ? "bg-[#5c61f1] text-white" : "bg-gray-200 text-white"
          }`}
        >
          1
        </div>
        <span
          className={`mx-2 text-sm font-semibold ${
            step === 1 ? "text-[#5c61f1]" : "text-white"
          }`}
        >
          Account
        </span>
      </div>
      <div
        className={`w-8 h-1 mx-2 rounded ${
          step === 2 ? "bg-[#5c61f1]" : "bg-gray-200"
        }`}
      ></div>
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 2 ? "bg-[#5c61f1] text-white" : "bg-gray-200 text-white"
          }`}
        >
          2
        </div>
        <span
          className={`mx-2 text-sm font-semibold ${
            step === 2 ? "text-[#5c61f1]" : "text-white"
          }`}
        >
          Face
        </span>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative min-h-screen flex items-center lg:ml-30">
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

        <div className="z-20  flex w-full lg:w-[30%] rounded-3xl overflow-hidden glass p-10 flex-col justify-center shadow-xl ">
          <Stepper />
          {step === 1 && (
            <form onSubmit={handleNext} className="">
              <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
              <p className="mb-6 text-white">
                Create your account to get started.
              </p>
              <div className="w-full mb-4">
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium text-white"
                >
                  User Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 text-gray-900 py-2 bg-[#f8f9fa] border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full mb-4">
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-[#f8f9fa] border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full mb-4 relative">
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pr-10 bg-[#f8f9fa] text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <div
                  className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{ top: "2.85rem" }}
                >
                  {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                </div>
              </div>
              <button
                className="w-full bg-[#5c61f1] text-white p-3 rounded font-semibold shadow-xl cursor-pointer"
                type="submit"
              >
                Next
              </button>
              <div className="mt-4 text-red-600 text-center">{message}</div>
            </form>
          )}

          {step === 2 && (
            <div className=" flex items-center justify-center ">
              <form
                onSubmit={handleFinishRegister}
                className="space-y-4 text-center"
              >
                <FaceRegister
                  descriptors={descriptors}
                  setDescriptors={setDescriptors}
                />

                <div className="flex gap-2 mt-4 items-center justify-center">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-900 px-5 py-2 rounded font-semibold cursor-pointer"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="bg-[#5c61f1] text-white px-5 py-2 rounded font-semibold shadow-xl cursor-pointer"
                    type="submit"
                  >
                    Register
                  </button>
                </div>

                <div className="mt-4 text-red-600 text-center">{message}</div>
              </form>
            </div>
          )}

          <div className="text-center mt-6">
            <span className="text-sm text-white">Already registered </span>
            <a href="/" className="text-white font-semibold underline text-sm">
              Sign In
            </a>
          </div>
        </div>
        <div className="hidden lg:flex w-[50%]   flex-col justify-center items-center text-white text-center p-8 space-y-4 z-10 m-auto">
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
    </>
  );
}
