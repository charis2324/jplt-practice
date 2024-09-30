import React, { useContext, useEffect, useState, useReducer, useRef, useMemo } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import { updateQuizSessionAnswers, submitQuizSession } from '../db';
import { AuthContext } from '../contexts/AuthContext';
import debounce from 'lodash.debounce';
import LoadingIndicator from './LoadingIndicator';

const parseQuizDataToQuestionState = (quizData) => {
  return quizData.questions.map((question) => {
    const answerState = question.answer_state;
    return {
      questionId: question.question_id,
      quizSessionAnswerId: answerState?.quiz_session_answer_id,
      userAnswer: answerState?.user_answer || {},
      isReported: answerState?.is_reported,
      isCorrect: answerState?.is_correct
    }
  })
}

const Quiz = ({ quizData, isContinue, onNextQuiz, onExitQuiz }) => {
  // const { user } = useContext(AuthContext);
  const session_id = quizData.quiz_session_id;
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const initialQuestionsState = parseQuizDataToQuestionState(quizData)

  const questionsReducer = (state, action) => {
    switch (action.type) {
      case 'SINGLE_OPTION':
        return state.map((q, index) =>
          index === action.payload.index ? { ...q, userAnswer: { type: action.type, value: action.payload.value } } : q
        );
      case 'REPORT_QUESTION':
        return state.map((q, index) =>
          index === action.payload.index ? { ...q, isReported: true } : q
        );
      case 'FULL_UPDATE':
        return action.payload.questionsState;
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
    try {
      await updateQuizSessionAnswers(questionsStateRef.current);
    } catch (error) {
      console.error('Failed to update session responses:', error);
    }
  };

  const debouncedUpdateSessionResponses = useMemo(
    () => debounce(updateSessionResponses, 1000),
    []
  );

  const handleAnswerChange = (index, { type, value }) => {
    if (quizSubmitted) return;
    dispatch({ type: type, payload: { index, value } });
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
      return score + (q.isCorrect ? 1 : 0);
    }, 0);
  };

  const validQuestionCount = questionsState.filter((q) => !q.isReported).length;

  const handleSubmitQuiz = async () => {
    const unansweredQuestions = questionsState.reduce((acc, q, index) => {
      if (!q.isReported && (q.userAnswer?.value == null)) acc.push(index + 1);
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
        debouncedUpdateSessionResponses.flush();
        setSubmitLoading(true);
        await updateSessionResponses();
        const submitQuizData = await submitQuizSession(session_id);
        const submitQuestionState = parseQuizDataToQuestionState(submitQuizData);
        dispatch({ type: 'FULL_UPDATE', payload: { questionsState: submitQuestionState } })
        setQuizSubmitted(true);
        setError(null);
      } catch (e) {
        console.error('Error submitting quiz:', e);
        setError(e.message);
      } finally {
        setSubmitLoading(false);
      }
    }
  };
  useEffect(
    () => {
      console.log(questionsState)
    }, [questionsState]
  )
  return (
    <div className="container mx-auto p-4">
      {quizData.questions.map((question, index) => {
        const qState = questionsState[index];
        const questionType = question.question_type;
        const questionData = question.question_data;
        return (
          <div key={question.question_id} className="mb-8">
            {(() => {
              switch (questionType) {
                case "MULTIPLE_CHOICE_SINGLE":
                  return (
                    <MultipleChoiceQuestion
                      questionNumber={index}
                      questionText={questionData.question_text}
                      options={questionData.options}
                      correctAnswer={questionData.correct_answer.value}
                      showCorrectAnswer={quizSubmitted || qState.isReported || qState.isCorrect != null}
                      selectedOption={qState.userAnswer?.value}
                      onOptionSelect={(option) => handleAnswerChange(index, { 'type': question.question_data.correct_answer.type, 'value': option })}
                      onReportQuestion={() => handleReportQuestion(index)}
                    />
                  );
                // Add more cases as needed
                default:
                  return <div>Unsupported question type: {questionType}</div>;
              }
            })()}

            {/* Explanation and Reporting */}
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

      {!quizSubmitted ? (!isSubmitLoading ? (
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
        </div>) : (
        <LoadingIndicator />
      )
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

export default Quiz;