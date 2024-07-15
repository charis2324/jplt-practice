import React, { useState } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';

const MultipleChoiceQuiz = ({ quizData }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(quizData.questions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleAnswerSelect = (questionIndex, answer) => {
    if (!quizSubmitted) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[questionIndex] = answer;
      setSelectedAnswers(newSelectedAnswers);
      setError(null); // Clear any previous error when an answer is selected
    }
  };

  const handleSubmitQuiz = () => {
    const unansweredQuestions = selectedAnswers.reduce((acc, answer, index) => {
      if (answer === null) acc.push(index + 1);
      return acc;
    }, []);

    if (unansweredQuestions.length > 0) {
      setError(
        `Please answer all questions before submitting. Unanswered questions: ${unansweredQuestions.join(
          ', '
        )}`
      );
    } else {
      setQuizSubmitted(true);
      setError(null);
    }
  };

  const handleRestartQuiz = () => {
    setQuizSubmitted(false);
    setSelectedAnswers(Array(quizData.questions.length).fill(null));
    setError(null);
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return (
        score + (answer === quizData.questions[index].correctAnswer ? 1 : 0)
      );
    }, 0);
  };

  return (
    <div className="container mx-auto p-4">
      {quizData.questions.map((question, index) => (
        <div key={question.id} className="mb-8">
          <MultipleChoiceQuestion
            id={question.id}
            question={question.question.japanese}
            options={question.options}
            correctAnswer={question.correctAnswer}
            showCorrectAnswer={quizSubmitted}
            selectedOption={selectedAnswers[index]}
            onOptionSelect={(option) => handleAnswerSelect(index, option)}
          />
          {quizSubmitted && question.explanation && (
            <div className="mt-4 p-4 bg-yellow-100 rounded-md">
              <p className="text-yellow-800">{question.explanation}</p>
            </div>
          )}
        </div>
      ))}

      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!quizSubmitted ? (
        <button
          onClick={handleSubmitQuiz}
          className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-4">
            Your score: {calculateScore()} / {quizData.questions.length}
          </p>
          <button
            onClick={handleRestartQuiz}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuiz;
