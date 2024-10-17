import React from 'react';

const Feedback = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-emerald-500 to-green-500 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white bg-opacity-80 rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Thank You for Filling Out the Form!
        </h1>
        {/* <p className="text-lg text-center text-gray-700 mb-6">
          We appreciate your time and effort. We would love to hear about your experience. Your feedback helps us improve and serve you better.
        </p>
        <form className="flex flex-col space-y-4">
          <textarea
            className="w-full p-4 text-gray-800 rounded-lg shadow-sm border focus:ring-teal-500 focus:border-teal-500"
            rows="5"
            placeholder="Please share your feedback here..."
          ></textarea>
          <button
            type="submit"
            className="bg-teal-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-teal-700 transition duration-300"
          >
            Send Feedback
          </button>
        </form> */}
      </div>
    </div>
  );
};

export default Feedback;
