import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AutoResizeTextarea from '../components/AutoResizeTextarea';
import axios from 'axios';

function FormPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [user, setUser] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null); // Timer state
  const navigate = useNavigate();

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
    let currUser = getItemWithExpiry("user");
    if (!currUser) {
      navigate(`/user/login/${formId}`);
      return;
    }
    currUser = JSON.parse(currUser)
    setUser(currUser);
    fetchSubmission(currUser._id, formId); 
  }, [formId, navigate]);

  const fetchSubmission = async (userId, formId) => {
    const url = import.meta.env.VITE_BACKEND_URL + "/api/forms/get-submission";
    try {
      const data = { userId, formId };
      
      const response = await axios.post(url, data, { withCredentials: true });
      if (response.status === 200 && response.data.submission) {
        navigate('/feedback-page');
      }
    } catch (error) {
      console.log("Error fetching submission", error);
    }
  };

  const fetchForm = async () => {
    const url = import.meta.env.VITE_BACKEND_URL + "/api/forms/get-form";
    try {
      const response = await axios.get(url, {
        params: { formId },
        withCredentials: true
      });
      if (response.status === 200) {
        const formData = response.data.form;
        setForm(formData);

        if (formData.formType === 'quiz') {
          const savedEndTime = localStorage.getItem(`endTime-${formId}`);
          if (savedEndTime) {
            const remainingTime = Math.floor((new Date(savedEndTime) - new Date()) / 1000);
            if (remainingTime > 0) {
              setTimeRemaining(remainingTime);
            } else {
              handleSubmit(); // Auto-submit if time has already elapsed
            }
          } else {
            const formTime = parseInt(formData.time, 10);
            if (!isNaN(formTime)) {
              const endTime = new Date().getTime() + formTime * 60 * 1000;
              localStorage.setItem(`endTime-${formId}`, new Date(endTime));
              setTimeRemaining(formTime * 60);
            } else {
              console.error("Form time is not a valid number");
            }
          }
        }
      } else {
        console.log("Error in form response");
      }
    } catch (error) {
      console.error("Error fetching form", error);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [formId]);

  useEffect(() => {
    let timer;
    if (timeRemaining !== null && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmit(); // Auto-submit the form when the timer reaches zero
    }
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleChange = (questionId, value) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form) return;

    const url = import.meta.env.VITE_BACKEND_URL + "/api/forms/submit-form";
    const submissionData = {
      userId: user._id,
      formId,
      responses: Object.keys(responses).map(questionId => ({
        questionId,
        answer: responses[questionId]
      }))
    };

    try {
      const response = await axios.post(url, submissionData, {
        withCredentials: true
      });
      if (response.status === 200) {
        localStorage.removeItem(`endTime-${formId}`);
        navigate("/feedback-page"); 
      } else {
        console.log("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className='sm:max-w-2xl sm:mx-auto'>
      {form && form.formType === 'quiz' && (
        <div className="text-right text-lg">
          Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? '0' : ''}{timeRemaining % 60}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {form ? (
          <>
            <div className='text-center text-3xl font-semibold'>{form.title}</div>
            <div className='text-center text-xl font-mono'>{form.description}</div>
            {form.questions.map((question, index) => (
              <div key={question.id} className="p-4 border rounded-md shadow-md">
                <h3 className="font-bold">Question {index + 1}</h3>
                <p>{question.title}</p>
                {question.type === 'MCQ' && (
                  <ul className="ml-5 list-none">
                    {question.options.map((option, idx) => (
                      <li key={idx}>
                        <label>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            className="mr-2"
                            onChange={() => handleChange(question.id, option)}
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
                {question.type === 'SA' && (
                  <AutoResizeTextarea
                    name={`answer-${index}`}
                    rows={1}
                    placeholder="Short Answer"
                    onChange={(e) => handleChange(question.id, e.target.value)}
                  />
                )}
                {question.type === 'LA' && (
                  <AutoResizeTextarea
                    name={`answer-${index}`}
                    rows={4}
                    placeholder="Long Answer"
                    onChange={(e) => handleChange(question.id, e.target.value)}
                  />
                )}
              </div>
            ))}
            <button type="submit" className="py-2 px-4 font-mono rounded-md hover:bg-lime-800 hover:shadow-lg bg-lime-700 text-white w-full sm:w-auto">
              Submit Response
            </button>
          </>
        ) : (
          <div>Loading form...</div>
        )}
      </form>
    </div>
  );
}

export default FormPage;