import React from 'react';

const MultipleChoiceQuestion = ({
  questionNumber,
  questionId,
  quizSessionAnswerId,
  questionData,
  showCorrectAnswer,
  selectedOption,
  onOptionSelect,
  onReportQuestion,
  showReportBtn = true,
  showShadow = true,
  useSpacing = true
}) => {
  const questionText = questionData?.question_text
  const options = questionData?.options
  const correctAnswer = questionData?.correct_answer
  // Determine the CSS classes for each option based on the state
  const getOptionClass = (optionKey) => {
    if (!showCorrectAnswer) {
      // Before showing correct answers
      return selectedOption === optionKey
        ? 'bg-blue-100 border-blue-500'
        : 'bg-gray-100 hover:bg-gray-200';
    }

    // After showing correct answers
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
          {!isNaN(questionNumber) && (
            <span className="font-bold text-lg text-blue-600">Q {questionNumber + 1}:</span>
          )}
        </div>
        {showReportBtn && (
          <button
            onClick={() => onReportQuestion(questionId)}
            className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors text-sm font-medium"
          >
            Report Low Quality
          </button>
        )}
      </div>
      <p className="mb-4 text-gray-800">{questionText}</p>
      <div className="space-y-2">
        {options.map(({ option_id, text }) => (
          <label
            key={option_id}
            className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${getOptionClass(
              option_id
            )}`}
          >
            <input
              type="radio"
              name={`question-${questionNumber}`}
              value={option_id}
              checked={selectedOption === option_id}
              onChange={() => onOptionSelect(option_id)}
              className="form-radio h-5 w-5 text-blue-600"
              disabled={showCorrectAnswer}
            />
            <span className="ml-2 text-gray-700">
              {option_id}. {text}
            </span>
            {showCorrectAnswer && option_id === correctAnswer && (
              <span className="ml-2 text-green-600 font-bold">(Correct Answer)</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;