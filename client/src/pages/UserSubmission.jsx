import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserSubmission = () => {
  const { userId, formId } = useParams();
  const [form, setForm] = useState(null);
  const [submission, setSubmission] = useState(null);

  const fetchForm = async () => {
    const url = import.meta.env.VITE_BACKEND_URL + "/api/forms/get-form";
    try {
      const response = await axios.get(url, {
        params: { formId },
        withCredentials: true
      });
      if (response.status === 200) {
        setForm(response.data.form);
      } else {
        console.log("Error fetching form");
      }
    } catch (error) {
      console.log("Error fetching form", error);
    }
  };

  const fetchSubmission = async () => {
    const url = import.meta.env.VITE_BACKEND_URL + "/api/forms/get-submission";
    try {
      const response = await axios.post(url, {
        userId,
        formId
      }, { withCredentials: true });
      if (response.status === 200) {
        setSubmission(response.data.submission);
      } else {
        console.log("Error fetching submission");
      }
    } catch (error) {
      console.log("Error fetching submission", error);
    }
  };

  useEffect(() => {
    fetchForm();
    fetchSubmission();
  }, [userId, formId]);

  if (!form || !submission) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
      {form.questions.map((question, index) => {
        const userResponse = submission.responses.find(
          response => response.questionId === question.id
        );
        return (
          <div key={question.id} className="mb-4 p-4 border rounded-md shadow-md">
            <h3 className="font-bold mb-2">Question {index + 1}: {question.title}</h3>
            <p className="ml-4">User's Answer: {userResponse ? userResponse.answer : 'No response'}</p>
          </div>
        );
      })}
    </div>
  );
};

export default UserSubmission;
