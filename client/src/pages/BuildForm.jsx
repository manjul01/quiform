import React, { useEffect, useState } from "react";
import QuestionSkeleton from "../components/QuestionSkeleton";
import AutoResizeTextarea from "../components/AutoResizeTextarea";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function BuildForm() {
  const [form, setForm] = useState([]);
  const [title, setTitle] = useState("your title goes here...");
  const navigate = useNavigate();
  const [description, setDescription] = useState("Describe your form here...");
  const { formType } = useParams();
  const [user, setUser] = useState();
  const [time, setTime] = useState(10);
  // console.log(formType);

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
      navigate("/user/login/home");
      return;
    }
    currUser = JSON.parse(currUser)
    setUser(currUser);
  }, []);

  const addQuestionHandler = (question) => {
    setForm((prevForm) => [...prevForm, { ...question, id: uuidv4() }]);
  };

  //store the form in db, get the unique id and then move to formPage with the unique Id

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = import.meta.env.VITE_BACKEND_URL + "/api/forms/generate-form";
    const data = {
      formType,
      title,
      time,
      description,
      creator: user._id,
      questions: form,
    };
    
    const validFormTypes = ["survey", "quiz"];
    if (!validFormTypes.includes(data.formType)) {
      console.log("Invalid form type");
      return;
    }

    if (!data.title) {
      console.log("Title is required");
      return;
    }
    if (!data.description || typeof data.description !== "string") {
      console.log("Description is required ");
      return;
    }
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      console.log("Atleast add one question");
      return;
    }

    for (const question of data.questions) {
      if (!question.title) {
        console.log("Each question must have a title");
        return;
      }
      if (data.formType === "quiz" && !question.answer) {
        console.log(
          `Each quiz question must have an answer: ${question.title}`
        );
        return;
      }

      if (question.type === "MCQ" && !question.options) {
        console.log("add options for each MCQ");
        return;
      }
    }

    try {
      const response = await axios.post(url, data, { withCredentials: true });

      if (response.status === 200) {
        const formId = response.data.formId;
        // console.log("formId.....", formId);
        navigate(`/form/${formId}`);
      }
    } catch (error) {
      console.log("error in submitting form", error);
    }
  };

  return (
    <div className="sm:max-w-2xl sm:mx-auto">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="text-center text-2xl font-semibold border p-2 font-mono mt-1 shadow-md w-full"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="jshd"
          value={title}
        ></input>

        <textarea
          name="description"
          id=""
          cols="30"
          rows="5"
          placeholder="Enter your form description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-1 text-sm border"
        />
        {formType === "quiz" && (
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2 ">
              Submission time in minutes :{" "}
            </span>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-center text-2xl font-semibold border p-1 font-mono mt-1 shadow-md "
            ></input>
          </div>
        )}

        {form.map((question, index) => (
          <div key={question.id} className="p-4 border rounded-md shadow-md">
            <h3 className="font-bold">Question {index + 1}</h3>
            <p>{question.title}</p>
            {question.type === "MCQ" && (
              <ul className="ml-5 list-none">
                {question.options.map((option, idx) => (
                  <li key={idx}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            )}
            {question.type === "SA" && (
              <AutoResizeTextarea
                name={`answer-${index}`}
                rows={1}
                placeholder="Short Answer"
              />
            )}
            {question.type === "LA" && (
              <AutoResizeTextarea
                name={`answer-${index}`}
                rows={4}
                placeholder="Long Answer"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="py-2 px-4 font-mono rounded-md hover:bg-lime-800 hover:shadow-lg bg-lime-700 text-white w-full sm:w-auto"
        >
          Generate Form
        </button>
      </form>

      <QuestionSkeleton
        addQuestionHandler={addQuestionHandler}
        formType={formType}
      />
    </div>
  );
}

export default BuildForm;
