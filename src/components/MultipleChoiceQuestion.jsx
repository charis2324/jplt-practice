import React from 'react';

const MultipleChoiceQuestion = ({
  id,
  question,
  options,
  correctAnswer,
  showCorrectAnswer,
  selectedOption,
  onOptionSelect,
}) => {
  const getOptionClass = (optionKey) => {
    if (!showCorrectAnswer) {
      return selectedOption === optionKey
        ? 'bg-blue-100 border-blue-500'
        : 'bg-gray-100 hover:bg-gray-200';
    }

    if (optionKey === correctAnswer) {
      return 'bg-green-100 border-green-500';
    }
    if (selectedOption === optionKey && optionKey !== correctAnswer) {
      return 'bg-red-100 border-red-500';
    }
    return 'bg-gray-100';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="mb-4">
        <span className="font-bold text-lg text-blue-600">Question {id}:</span>
        <p className="mt-2 text-gray-800">{question}</p>
      </div>
      <div className="space-y-2">
        {Object.entries(options).map(([key, value]) => (
          <label
            key={key}
            className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${getOptionClass(
              key
            )}`}
          >
            <input
              type="radio"
              name={`question-${id}`}
              value={key}
              checked={selectedOption === key}
              onChange={() => onOptionSelect(key)}
              className="form-radio h-5 w-5 text-blue-600"
              disabled={showCorrectAnswer}
            />
            <span className="ml-2 text-gray-700">
              {key}. {value}
            </span>
            {showCorrectAnswer && key === correctAnswer && (
              <span className="ml-2 text-green-600 font-bold">
                (Correct Answer)
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
