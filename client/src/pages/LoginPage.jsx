import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorBar from "../components/ErrorBar";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mess, setMess] = useState("");
  const navigate = useNavigate();
  const { source } = useParams();

  const setItemWithExpiry = (key, value, ttl) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMess("");

    try {
      const url = import.meta.env.VITE_BACKEND_URL + "/api/user/login";
      const data = {
        email,
        password,
      };

      const response = await axios.post(url, data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setItemWithExpiry("user", JSON.stringify(response.data.user), 24 * 60 * 60 * 1000); // 1 day expiry

        if (source === "home") navigate("/user/dashboard");
        else navigate(`/form/${source}`);
      } else {
        setMess("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during customer signin:", error);
      setMess("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-teal-300 via-teal-600 to-teal-800 p-6">
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl">
        <div className="md:w-1/2 p-8 flex flex-col justify-center items-center bg-teal-500 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m2 6H7a2 2 0 01-2-2V6a2 2 0 012-2h4.586a2 2 0 011.414.586l2.828 2.828A2 2 0 0117 8.414V16a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-3xl font-extrabold text-center mb-6">
            Back to Quiform? 
          </h2>
          <p className="text-center">
            Log in to access your personalized dashboard and see the latest updates. Continue creating and analyzing with our intuitive tools
          </p>
          <p className="font-semibold mt-2">Let’s continue building brilliant forms together.</p>
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 font-mono">
            Welcome User
          </h2>
          <form className="space-y-4">
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <button
              onClick={(e) => submitHandler(e)}
              type="submit"
              className="w-full bg-teal-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
            >
              Log In
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-gray-700">Not registered with us? </span>
            <Link
              to={`${source === "home" ? "/user/signup/home" : `/user/signup/${source}`}`}
              className="text-teal-500 hover:text-teal-600 font-semibold"
            >
              Signup here
            </Link>
          </div>
          {mess && <ErrorBar mess={mess} />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
