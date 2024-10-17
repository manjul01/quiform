import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SubmissionScore from '../components/SubmissionScore';

function Responses() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);

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

  const fetchSubmissions = async () => {
    const url = import.meta.env.VITE_BACKEND_URL + "/api/forms/get-submitted-form";
    try {
      const response = await axios.get(url, {
        params: { formId },
        withCredentials: true
      });
      if (response.status === 200) {
        // console.log("submitted data " , response.data)
        setSubmissions(response.data);
      } else {
        console.log("Error fetching submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions", error);
    }
  };

  useEffect(() => {
    fetchForm();
    fetchSubmissions();
  }, [formId]);
  // console.log("form is ---------------" ,form)
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Form Submissions</h1>
      {form && submissions.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User</th>
              <th className="py-2 px-4 border-b">Score</th>
              <th className="py-2 px-4 border-b">Submission Time</th>
              <th className="py-2 px-4 border-b">View Answer</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <SubmissionScore
                key={submission._id}
                
                form={form}
                submission={submission}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Responses;
