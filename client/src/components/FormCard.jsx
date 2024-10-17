import React from 'react';

const FormCard = ({ formType, title, createdAt  , onClickHandler}) => {
  return (
    <div 
    onClick={onClickHandler}
    className="bg-white p-4 rounded-lg shadow-lg max-w-40 hover:scale-105 cursor-pointer border-2">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${formType === 'quiz' ? 'bg-indigo-800 text-white' : 'bg-green-500 text-white'}`}>
          {formType[0].toUpperCase() + formType.slice(1)}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2 truncate">{title}</h3>
      <p className="text-gray-500 text-sm">{new Date(createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default FormCard;
