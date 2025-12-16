import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FaceLogin from "../components/faceLogin";
import bgVideo from "../assets/bg-video.mp4";
import { LuEye, LuEyeOff, LuSmile } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const videoRef = useRef(null); 
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showFaceLogin, setShowFaceLogin] = useState(false);

  const handleNormalLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URI}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ email: res.data.email, token: res.data.token })
      );
      if (videoRef.current) {
        videoRef.current.pause();
      }
      toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
      // navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed!!");
      setTimeout(1500);
    }
  };

  const handleFaceLogin = async (descriptor) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URI}/api/auth/face-login`,
        { descriptor }
      );

      localStorage.setItem(
        "user",
        JSON.stringify({ email: res.data.email, token: res.data.token })
      );
      if (videoRef.current) {
        videoRef.current.pause();
      }
      toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
      setShowFaceLogin(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Face login error:", err);
      toast.error("Login failed!!");
      setTimeout(1500);
    }
  };

  const handleFaceLoginClose = () => {
    setShowFaceLogin(false);
  };

  return (
    <div className="relative min-h-screen flex items-center">
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

      <div className="lg:ml-30 z-20 w-full flex gap-30 rounded-3xl overflow-hidden">
        <div className=" lg:w-[30%] w-full  glass  p-10 flex flex-col justify-center ">
          {!showFaceLogin ? (
            <>
              <h2 className="text-3xl font-bold mb-2">Sign In</h2>
              <p className="mb-6 text-white">
                Please Login to continue to your account.
              </p>
              <form onSubmit={handleNormalLogin} className="space-y-4">
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
                    className="w-full px-3 py-2 bg-[#f8f9fa] text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
                    {showPassword ? (
                      <LuEyeOff size={20} />
                    ) : (
                      <LuEye size={20} />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 accent-[#5c61f1] " />
                    <span className="text-sm font-medium text-white">
                      Remember Me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-white underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  className="mt-4 w-full cursor-pointer bg-green-600  text-white p-3 rounded font-semibold shadow-xl"
                  type="submit"
                >
                  Login
                </button>
              </form>
              <div className="mt-6 my-4 flex items-center">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="mx-3 text-gray-400 text-sm">
                  Or login with
                </span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>
              <div className="w-full flex justify-center mb-4">
                <button
                  className="w-full  bg-[#5c61f1] text-white p-3 cursor-pointer rounded font-semibold shadow-xl mb-4 flex items-center justify-center gap-2"
                  onClick={() => setShowFaceLogin(true)}
                  type="button"
                >
                  <LuSmile className="text-xl" />
                  <span>Login with Face</span>
                </button>
              </div>
              <div className="text-center">
                <span className="text-sm text-white">
                  Don't have an account?{" "}
                </span>
                <a
                  href="/signup"
                  className="text-white font-semibold underline text-sm"
                >
                  Create Now
                </a>
              </div>
              <div className="mt-2 text-green-700 text-center hidden">
                {message}
              </div>
            </>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Face Login</h2>
                <button
                  className="text-white hover:text-red-600 text-xl cursor-pointer"
                  onClick={handleFaceLoginClose}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <FaceLogin onLogin={handleFaceLogin} />
              <div className="mt-6 my-4 flex items-center">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="mx-3 text-gray-400 text-sm">
                  Or login with
                </span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>
              <button
                on
                onClick={handleFaceLoginClose}
                className=" w-full cursor-pointer bg-green-600 text-white p-3 rounded font-semibold shadow-xl mb-4 flex items-center justify-center gap-2"
              >
                login with user credentials
              </button>
              <div className="mt-2 text-green-700 text-center hidden">
                {message}
              </div>
            </div>
          )}
        </div>
        <div className="hidden lg:flex w-[50%]  flex-col justify-center items-center text-white text-center p-8 space-y-4">
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
    </div>
  );
}
