import React from 'react';

const PlusIconCard = ({ bgColor, text }) => {
  return (
    <div className={`flex flex-col cursor-pointer items-center justify-center p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105`} style={{ backgroundColor: bgColor }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <p className="text-white text-lg font-semibold text-center">{text}</p>
    </div>
  );
};

export default PlusIconCard;
