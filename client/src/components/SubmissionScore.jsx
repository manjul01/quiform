import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SubmissionScore({ form, submission }) {
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate()
    
  const fetchUser = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/user-info`;
    try {
      const response = await axios.get(url, {
        params: { userId: submission.userId },
        withCredentials: true
      });
      if (response.status === 200) {
        setUser(response.data);
      } else {
        console.log("Error fetching user");
      }
    } catch (error) {
      console.log("Error fetching user", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [submission.userId]);

  useEffect(() => {
    const calculateScore = () => {
      let calculatedScore = 0;
      submission.responses.forEach((response) => {
        const question = form.questions.find(q => q.id === response.questionId);
        if (question && question.answer === response.answer) {
          calculatedScore++;
        }
      });
      setScore(calculatedScore);
    };

    if (form) {
      calculateScore();
    }
  }, [form, submission]);

  return (
    <tr>
      <td className="py-2 px-4 border-b text-center">{user ? user.name : 'Loading...'}</td>
      <td className="py-2 px-4 border-b text-center">{score}</td>
      <td className="py-2 px-4 border-b text-center">{new Date(submission.createdAt).toLocaleString()}</td>
      <td className="py-2 px-4 border-b text-center">
        <button 
        onClick={() => navigate(`/form/user-submission/${form._id}/${submission.userId}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded text-center">
            
          View Answer
        </button>
      </td>
    </tr>
  );
}

export default SubmissionScore;
