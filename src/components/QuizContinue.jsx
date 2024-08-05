import React from 'react';

const QuizContinue = ({ onContinue }) => {
  return (
    <div className="max-w-md mx-auto mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Continue Quiz</h2>
      <p className="mb-4 text-pretty">You have an unfinished quiz. Would you like to continue?</p>
      <button
        onClick={onContinue}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Continue Quiz
      </button>
    </div>
  );
};

export default QuizContinue;