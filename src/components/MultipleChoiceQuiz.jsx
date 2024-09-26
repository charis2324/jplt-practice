import React, { useContext, useEffect, useState, useReducer, useRef, useMemo } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import { submit_user_quiz_answers, update_quiz_session_responses } from '../db';
import { AuthContext } from '../contexts/AuthContext';
import debounce from 'lodash.debounce';

const MultipleChoiceQuiz = ({ quizData, isContinue, onNextQuiz, onExitQuiz }) => {
  const { user } = useContext(AuthContext);
  const session_id = quizData.session_id;
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Initialize state using useReducer
  const initialQuestionsState = quizData.questions.map((question) => {
    const response = quizData.session_responses.find((qs) => qs.question_id === question.id) || {};
    return {
      question_id: question.id,
      selectedAnswer: response.response_answer || null,
      isReported: response.is_reported || false,
      correctAnswer: question.correctAnswer,
    };
  });

  const questionsReducer = (state, action) => {
    switch (action.type) {
      case 'SELECT_ANSWER':
        return state.map((q, index) =>
          index === action.payload.index ? { ...q, selectedAnswer: action.payload.answer } : q
        );
      case 'REPORT_QUESTION':
        return state.map((q, index) =>
          index === action.payload.index ? { ...q, isReported: true } : q
        );
      default:
        return state;
    }
  };

  const [questionsState, dispatch] = useReducer(questionsReducer, initialQuestionsState);
  const questionsStateRef = useRef(questionsState);

  useEffect(() => {
    questionsStateRef.current = questionsState;
  }, [questionsState]);

  // Debounced function to update session responses
  const updateSessionResponses = async () => {
    const session_responses = questionsStateRef.current.map((q) => ({
      question_id: q.question_id,
      response_answer: q.selectedAnswer,
      is_reported: q.isReported,
    }));
    try {
      await update_quiz_session_responses(session_id, { session_responses });
    } catch (error) {
      console.error('Failed to update session responses:', error);
    }
  };

  const debouncedUpdateSessionResponses = useMemo(
    () => debounce(updateSessionResponses, 1000),
    [session_id]
  );

  const handleAnswerSelect = (index, answer) => {
    if (quizSubmitted) return;
    dispatch({ type: 'SELECT_ANSWER', payload: { index, answer } });
    setError(null);
    debouncedUpdateSessionResponses();
  };

  const handleReportQuestion = (index) => {
    dispatch({ type: 'REPORT_QUESTION', payload: { index } });
    setError(null);
    debouncedUpdateSessionResponses();
  };

  const calculateScore = () => {
    return questionsState.reduce((score, q) => {
      if (q.isReported) return score;
      return score + (q.selectedAnswer === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  const validQuestionCount = questionsState.filter((q) => !q.isReported).length;

  const handleSubmitQuiz = async () => {
    const unansweredQuestions = questionsState.reduce((acc, q, index) => {
      if (!q.isReported && !q.selectedAnswer) acc.push(index + 1);
      return acc;
    }, []);

    if (unansweredQuestions.length > 0) {
      setError(
        `Please answer all questions before submitting. Unanswered questions: ${unansweredQuestions.join(
          ', '
        )}`
      );
    } else {
      try {
        setQuizSubmitted(true);
        setError(null);
        const session_responses = questionsState.map((q) => ({
          question_id: q.question_id,
          response_answer: q.selectedAnswer,
          is_reported: q.isReported,
        }));
        await submit_user_quiz_answers(session_id, { session_responses });
      } catch (e) {
        console.error('Error submitting quiz:', e);
        setError(e.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      {quizData.questions.map((question, index) => {
        const qState = questionsState[index];
        return (
          <div key={question.id} className="mb-8">
            <MultipleChoiceQuestion
              question_number={index}
              question_id={question.id}
              question={question.question}
              options={question.options}
              correctAnswer={question.correctAnswer}
              showCorrectAnswer={quizSubmitted || qState.isReported}
              selectedOption={qState.selectedAnswer}
              onOptionSelect={(option) => handleAnswerSelect(index, option)}
              onReportQuestion={() => handleReportQuestion(index)}
            />
            {(quizSubmitted || qState.isReported) && question.explanation && (
              <div className="mt-4 p-4 bg-yellow-100 rounded-md">
                <p className="text-yellow-800">{question.explanation}</p>
              </div>
            )}
            {qState.isReported && (
              <div className="mt-4 p-4 bg-red-100 rounded-md">
                <p className="text-red-800">
                  This question has been temporarily removed from scoring pending review by our team.
                </p>
              </div>
            )}
          </div>
        );
      })}

      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!quizSubmitted ? (
        <div className="mt-8 text-center space-x-3">
          <button
            onClick={handleSubmitQuiz}
            className="w-40 mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Quiz
          </button>
          <button
            onClick={onExitQuiz}
            className="w-40 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Exit Quiz
          </button>
        </div>
      ) : (
        <div className="mt-8 text-center space-x-3">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-4">
            Your score: {calculateScore()} / {validQuestionCount}
          </p>
          <button
            onClick={onExitQuiz}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Exit Quiz
          </button>
          {!isContinue && (
            <button
              onClick={onNextQuiz}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Next Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuiz;