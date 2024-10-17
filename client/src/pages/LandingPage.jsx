import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function App() {


  const [currUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
  
    const getItemWithExpiry = (key) => {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) {
        return null;
      }
      try {
        const item = JSON.parse(itemStr);
        const now = new Date();
        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }
        return item.value;
      } catch (error) {
        console.log("Error parsing localStorage item:", error);
        return null;
      }
    };
  
    useEffect(() => {
      const user = getItemWithExpiry("user");
      if (user) {
        // console.log("User found in localStorage:", user);
        navigate("/user/dashboard")
        setCurrentUser(JSON.parse(user));
      } else {
        // console.log("No user found in localStorage");
        setCurrentUser(null);
      }
    }, []);


  return (
    <div className="min-h-screen w-full flex flex-col items-center ">
      <div className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-blue-700 py-4 px-8 flex justify-center space-x-6 items-center sticky top-0 z-10 shadow-md">
        <button 
        onClick={() => navigate('/user/login/home')}
        className="text-white font-semibold hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition-all duration-300">
          Login
        </button>
        <button 
        onClick={() => navigate('/user/signup/home')}
        className="bg-white text-blue-600 font-semibold px-4 py-2 rounded shadow-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-300">
          Signup
        </button>
      </div>
      <div className="max-w-4xl shadow-md w-full mt-3 text-center text-6xl font-bold py-4 font-mono bg-gradient-to-r from-green-400 via-white to-blue-500">
        Quiform
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-4xl my-8 px-4 md:px-0">
        <div className="md:w-1/2 flex justify-center md:justify-start mb-8 md:mb-0">
          <img
            src="https://i.pinimg.com/736x/c8/04/84/c8048418c460f753d744612c9d0ef0c7.jpg"
            alt="Quiz Image"
            className="w-full h-auto max-w-sm rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left font-mono">
          <div className="text-3xl font-bold mb-4 w-full text-center">
            Build Interactive Quizzes!
          </div>
          <div className="text-2xl  mb-2 w-full text-center">or</div>
          <div className="text-3xl font-bold w-full text-center">
            Create Survey Forms for Your Company!
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mb-8">
        <img
          src="https://i.pinimg.com/736x/62/f9/c3/62f9c3b0d686bcdb8d5754904396ae75.jpg"
          alt="Dashboard"
          className="w-full h-auto max-w-4xl rounded-lg shadow-lg"
        />
      </div>
      <div className="text-center text-lg font-semibold mb-8 px-20 lg:px-64">
        Start creating your own forms and quizzes today with our easy-to-use
        platform. Whether you're looking to gather data for your business or
        engage your audience with fun, interactive content, our tools have you
        covered.
      </div>
    </div>
  );
}

export default App;
