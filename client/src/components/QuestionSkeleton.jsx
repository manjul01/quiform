

import React, { useState } from 'react';
import AutoResizeTextarea from './AutoResizeTextarea';

function QuestionSkeleton({ addQuestionHandler ,  formType}) {
  const [questionType, setQuestionType] = useState('MCQ');
  const [options, setOptions] = useState({ a: '', b: '', c: '', d: '' });
  const [answer, setAnswer] = useState('NA');
  const [title , setTitle] = useState("Enter your question here")
  const handleAddQuestion = () => {
    const question = {
      type: questionType,
      title,
      ...(questionType === 'MCQ' && { options: Object.values(options) }),
      answer
    };
    // console.table("question is---------" , question)
    addQuestionHandler(question);
    setQuestionType('MCQ');
    setOptions({ a: '', b: '', c: '', d: '' });
    setTitle("Enter your question here")
    setAnswer('');
  };

  const handleOptionChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-1 p-1 border rounded-md shadow-md">
      <div className="flex flex-col sm:flex-row justify-between">
      <div className="sm:w-2/3 w-full ">
          <AutoResizeTextarea
            name="Question"
            placeholder="Question"
            rows={1}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-700 outline-none w-full sm:w-1/3 sm:max-w-xs mb-1 px-1 rounded-md"
          onChange={(e) => setQuestionType(e.target.value)}
          value={questionType}
        >
          <option value="MCQ">Multiple Choice</option>
          <option value="SA">Short Answer</option>
          <option value="LA">Long Answer</option>
        </select>
      </div>
      {questionType === 'MCQ' && (
        <div className="mt-4 space-y-1">
          <input
            type="text"
            name="a"
            className="w-full border border-gray-500 rounded-md pl-1 pb-1 text-sm bg-slate-100"
            placeholder="a"
            value={options.a}
            onChange={handleOptionChange}
          />
          <input
            type="text"
            name="b"
            className="w-full border border-gray-500 rounded-md pl-1 pb-1 text-sm bg-slate-100"
            placeholder="b"
            value={options.b}
            onChange={handleOptionChange}
          />
          <input
            type="text"
            name="c"
            className="w-full border border-gray-500 rounded-md pl-1 pb-1 text-sm bg-slate-100"
            placeholder="c"
            value={options.c}
            onChange={handleOptionChange}
          />
          <input
            type="text"
            name="d"
            className="w-full border border-gray-500 rounded-md pl-1 pb-1 text-sm bg-slate-100"
            placeholder="d"
            value={options.d}
            onChange={handleOptionChange}
          />
          <input
            type="text"
            name="answer"
            className="w-full border border-gray-500 rounded-md pl-1 pb-1 text-sm bg-slate-100"
            placeholder="Answer : a / b / c / d"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      )}
      {questionType === 'SA' && (
        <AutoResizeTextarea
          name="Answer"
          placeholder="Tentative answer : Leave NA for manual checking"
          rows={1}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      )}
      {questionType === 'LA' && (
        <AutoResizeTextarea
          name="Answer"
          placeholder="Tentative answer : Leave NA for manual checking / survey form"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      )}
      <div className="mt-1 flex justify-center items-center">
        <button
          className="py-2 px-4 font-mono rounded-md hover:bg-lime-800 hover:shadow-lg bg-lime-700 text-white w-full sm:w-auto"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
      </div>
    </div>
  );
}

export default QuestionSkeleton;
