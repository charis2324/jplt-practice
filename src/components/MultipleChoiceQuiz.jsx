import React, { useState } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import { report_question, report_answered_incorrectly, report_answered_correctly } from '../db';


const MultipleChoiceQuiz = ({ quizData, onNextQuiz }) => {
  const correctAnswers = quizData.questions.map(q => q.correctAnswer);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(quizData.questions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [reportedQuestions, setReportedQuestions] = useState([]);
  
  const handleAnswerSelect = (questionIndex, answer) => {
    if (!quizSubmitted) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[questionIndex] = answer;
      setSelectedAnswers(newSelectedAnswers);
      setError(null);
    }
  };
  const submitResult = () => {
    quizData.questions.forEach((question, index) => {
      if (!reportedQuestions.includes(index)) {
        const isCorrect = selectedAnswers[index] === correctAnswers[index];
        const reportFunction = isCorrect ? report_answered_correctly : report_answered_incorrectly;
        reportFunction(question.id);
        console.log(index, isCorrect)
      }
    });
  }
  const handleSubmitQuiz = () => {
    const unansweredQuestions = selectedAnswers.reduce((acc, answer, index) => {
      if (answer === null && !reportedQuestions.includes(index)) acc.push(index + 1);
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
      submitResult();
    }
  };

  const handleRestartQuiz = () => {
    setQuizSubmitted(false);
    setSelectedAnswers(Array(quizData.questions.length).fill(null));
    setError(null);
    setReportedQuestions([]);
  };

  const handleReportQuestion = (questionId) => {
    const questionIndex = quizData.questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1 && !reportedQuestions.includes(questionIndex)) {
      setReportedQuestions([...reportedQuestions, questionIndex]);
      report_question(questionId);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      if (reportedQuestions.includes(index)) return score;
      return score + (answer === quizData.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const validQuestionCount = quizData.questions.length - reportedQuestions.length;

  return (
    <div className="container mx-auto p-4">
      {quizData.questions.map((question, index) => (
        <div key={question.id} className="mb-8">
          <MultipleChoiceQuestion
            question_number={index}
            question_id={question.id}
            question={question.question.japanese}
            options={question.options}
            correctAnswer={question.correctAnswer}
            showCorrectAnswer={quizSubmitted || reportedQuestions.includes(index)}
            selectedOption={selectedAnswers[index]}
            onOptionSelect={(option) => handleAnswerSelect(index, option)}
            onReportQuestion={handleReportQuestion}
          />
          {(quizSubmitted || reportedQuestions.includes(index)) && question.explanation && (
            <div className="mt-4 p-4 bg-yellow-100 rounded-md">
              <p className="text-yellow-800">{question.explanation}</p>
            </div>
          )}
          {reportedQuestions.includes(index) && (
            <div className="mt-4 p-4 bg-red-100 rounded-md">
              <p className="text-red-800">This question has been reported and will not be included in the final score.</p>
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
        <div className="mt-8 text-center space-x-3">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-4">
            Your score: {calculateScore()} / {validQuestionCount}
          </p>
          <button
            onClick={handleRestartQuiz}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reset Quiz
          </button>
          <button
            onClick={() => onNextQuiz()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuiz;