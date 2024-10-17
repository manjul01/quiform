import React, { useEffect, useState } from "react";
import PlusIconCard from "../components/PlusIconCard";
import FormCard from "../components/FormCard";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function DashBoard() {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [forms, setForms] = useState(null); // Modified to null for initial loading state
  const [loading, setLoading] = useState(true); // Loading state

  const getUserForms = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/forms-by-user`;
      const response = await axios.get(url, { withCredentials: true });

      if (response.status === 200) {
        // console.log(response.data.forms);
        setForms(response.data.forms);
      }
    } catch (error) {
      console.log("error fetching forms by user", error);
    } finally {
      setLoading(false); 
    }
  };
  const getItemWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  useEffect(() => {
    const fetchUserAndForms = async () => {
      let currUser = getItemWithExpiry("user");
      if (!currUser) {
        navigate("/user/login/home");
        return;
      }

      currUser = JSON.parse(currUser)
      setUser(currUser);
      getUserForms();
    };

    fetchUserAndForms();
  }, [navigate]);

  return (
    <>
      <div className="flex w-full items-center justify-center gap-5 py-6 flex-wrap bg-gradient-to-r from-green-500 to-blue-600">
        <Link to={"/user/build-form/survey"}>
          <PlusIconCard bgColor={"#166534"} text={"Create a Survey Form"} />
        </Link>
        <Link to={"/user/build-form/quiz"}>
          <PlusIconCard bgColor={"#312E81"} text={"Create a Quiz Form"} />
        </Link>
      </div>
      <div className="text-4xl font-semibold my-6 border-2 max-w-fit mx-auto px-4 py-2 shadow-md rounded-md text-gray-800">
        Your Forms
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-4 pt-2">
        {loading ? (
          <div>Loading...</div>
        ) : forms && forms.length > 0 ? (
          forms.map((form) => (
            <FormCard
              onClickHandler={() => navigate(`/form/responses/${form._id}`)}
              key={form._id}
              formType={form.formType}
              title={form.title}
              createdAt={form.createdAt}
            />
          ))
        ) : (
          <div>You have not created any form yet.</div>
        )}
      </div>
    </>
  );
}

export default DashBoard;
