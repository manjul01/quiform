import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      setCurrentUser(JSON.parse(user));
    } else {
      // console.log("No user found in localStorage");
      setCurrentUser(null);
    }
  }, []);

 

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {}, { withCredentials: true });
      localStorage.clear(); 
      setCurrentUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <header className="w-full sm:px-6 bg-emerald-900 text-white p-1 flex justify-between items-center shadow-md">
      <div 
      onClick={() => navigate("/user/dashboard")}
      className="flex items-center cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          className="h-8 w-8 fill-current text-white mr-2"
        >
          <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
        </svg>
        <span className="text-2xl font-bold">Quiform</span>
      </div>

      <div className="hidden sm:flex items-center gap-2 cursor-pointer h-full">
        <Link to="about-us" className="hover:bg-teal-500 hover:rounded-md px-2 py-2 hover:font-semibold">
          About Us
        </Link>
        {!currUser && (
          <Link to="/user/login/home" className="hover:bg-teal-500 hover:rounded-md px-2 py-2 hover:font-semibold">
            Log In
          </Link>
        )}
        {currUser && (
          <button onClick={logout} className="hover:bg-teal-500 hover:rounded-md px-2 py-2 hover:font-semibold">
            Log Out
          </button>
        )}
        {currUser && (
          <div className="flex items-center gap-2 hover:bg-teal-500 p-2 rounded-md cursor-pointer">
            <div>{currUser.name}</div>
            <div className="bg-teal-800 rounded-full h-8 w-8 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{currUser.name ? currUser.name[0].toUpperCase() : ''}</span>
            </div>
          </div>
        )}
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="sm:hidden h-8 w-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        viewBox="0 0 448 512"
      >
        <path
          fill="#ffffff"
          d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
        />
      </svg>

      {isOpen && (
        <div className="absolute top-10 flex-col-reverse left-0 w-full bg-emerald-900 flex items-center z-50">
          <Link to="about-us" className="hover:bg-teal-500 hover:rounded-md px-2 py-2 hover:font-semibold w-full text-center">
            About Us
          </Link>
          {!currUser && (
            <Link to="/user/login/home" className="hover:bg-teal-500 hover:rounded-md px-2 py-2 hover:font-semibold w-full">
              Log In
            </Link>
          )}
          {currUser && (
            <button onClick={logout} className="hover:bg-teal-500 hover:rounded-md px-2 py-2 hover:font-semibold w-full text-center">
              Log Out
            </button>
          )}
          {currUser && (
            <div 
            onClick={() => navigate("/user/dashboard")}
            className="flex items-center gap-2 hover:bg-teal-500 p-2 rounded-md w-full cursor-pointer justify-center">
              <div>{currUser.name}</div>
              <div className="bg-teal-800 rounded-full h-8 w-8 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{currUser.name ? currUser.name[0].toUpperCase() : ''}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
