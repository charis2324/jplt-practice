import React from 'react';

const MultipleChoiceQuestion = ({
  question_number,
  question_id,
  question,
  options,
  correctAnswer,
  showCorrectAnswer,
  selectedOption,
  onOptionSelect,
  onReportQuestion,
  showReportBtn = true,
  showShadow = true,
  useSpacing = true
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
    <div className={`bg-white rounded-lg ${useSpacing ? 'p-6 mb-6' : ''} ${showShadow ? 'shadow-md' : ''}`}>
      <div className="mb-2 flex justify-between items-start">
        <div>
          {!isNaN(question_number) && <span className="font-bold text-lg text-blue-600">Q {question_number + 1}:</span>}
        </div>
        {showReportBtn && <button
          onClick={() => onReportQuestion(question_id)}
          className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors text-sm font-medium"
        >
          Report Low Quality
        </button>}
      </div>
      <p className="mb-4 text-gray-800">{question}</p>
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
              name={`question-${question_number}`}
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