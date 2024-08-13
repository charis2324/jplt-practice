import React, { useContext, useEffect, useState, useCallback } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import { report_question, update_user_quiz_answer, submit_user_quiz_answers, update_quiz_session_responses } from '../db';
import { AuthContext } from '../contexts/AuthContext';
import debounce from 'lodash.debounce';


const MultipleChoiceQuiz = ({ quizData, isContinue, onNextQuiz, onExitQuiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(
    quizData.questions.map(q => {
      const response = quizData.session_responses.find((qs) => qs.question_id == q.id)
      return response.response_answer
    })
  );
  const session_id = quizData.session_id;
  const quiz_id = quizData.quiz_id;
  const questionIndexToId = quizData.questions.map(q => q.id);
  const { user } = useContext(AuthContext);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [reportedQuestions, setReportedQuestions] = useState(
    quizData.questions.map(q => {
      const response = quizData.session_responses.find((qs) => qs.question_id == q.id)
      return response.is_reported
    })
  )
  const getFullSessionResponses = (currentAnswers, currentReportedQuestions) => {
    return {
      session_responses: quizData.questions.map((q, index) => {
        return {
          question_id: q.id,
          response_answer: currentAnswers[index],
          is_reported: currentReportedQuestions[index]
        }
      })
    } 
  }
  const updateSessionResponses = async (newAnswers, newReportedQuestions) => {
    const fullSessionResponses = getFullSessionResponses(newAnswers, newReportedQuestions);
    console.log(fullSessionResponses);
    try {
      await update_quiz_session_responses(session_id, fullSessionResponses);
    } catch (error) {
      console.error('Failed to update session responses:', error);
      // Optionally set an error state or show a notification to the user
    }
  }
  const debouncedUpdateSessionResponses = useCallback(
    debounce((newAnswers, newReportedQuestions) => {
      updateSessionResponses(newAnswers, newReportedQuestions).catch(error => {
        console.error('Error in debounced update:', error);
        // Optionally set an error state or show a notification to the user
      });
    }, 1000),
    [session_id] // Dependencies array
  );
  // useEffect(() => {
  //   console.log('session_id: ', session_id)
  // }, [session_id])
  // useEffect(() => {
  //   console.log('quiz_id', quiz_id)
  // }, [quiz_id])
  // useEffect(() => {
  //   console.log('selectedAnswers:', selectedAnswers)
  // }, [selectedAnswers])
  // useEffect(() => {
  //   console.log('reportedQuestions:', reportedQuestions)
  // }, [reportedQuestions])
  const handleAnswerSelect = (questionIndex, answer) => {
    if (!quizSubmitted) {
      setSelectedAnswers((prevAnswers)=> {
        const newAnswers = [...prevAnswers];
        newAnswers[questionIndex] = answer;
        debouncedUpdateSessionResponses(newAnswers, reportedQuestions);
        return newAnswers;
      })
      setError(null);
    }
  }
  const submitResult = () => {
    try {
      const submittedQuizSessionResponses = submit_user_quiz_answers(session_id, getFullSessionResponses(selectedAnswers, reportedQuestions));
    } catch (e) {
      console.log('Catching error:', e);
      setError(e.message);
    }
  }
  const handleSubmitQuiz = () => {
    const unansweredQuestions = selectedAnswers.reduce((acc, answer, index) => {
      if (answer === null && reportedQuestions[index] === false) acc.push(index + 1);
      return acc;
    }, []);
    console.log(unansweredQuestions)
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
  const handleReportQuestion = (questionIndex) => {
    setReportedQuestions((prevReported )=> {
      const newReported = [...prevReported]
      newReported[questionIndex] =  true;
      debouncedUpdateSessionResponses(selectedAnswers, newReported);
      return newReported;
    })
    setError(null);
    console.log('handleReportQuestion questionId: ', questionIndexToId[questionIndex])
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      if (reportedQuestions[index]) return score;
      return score + (answer === quizData.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const validQuestionCount = quizData.questions.length - reportedQuestions.reduce((sum, rq) => { return rq ? sum + 1 : sum }, 0);
  return (
    <div className="container mx-auto p-4">
      {quizData.questions.map((question, index) => (
        <div key={question.id} className="mb-8">
          <MultipleChoiceQuestion
            question_number={index}
            question_id={question.id}
            question={question.question}
            options={question.options}
            correctAnswer={question.correctAnswer}
            showCorrectAnswer={quizSubmitted || reportedQuestions[index]}
            selectedOption={selectedAnswers[index]}
            onOptionSelect={(option) => handleAnswerSelect(index, option)}
            onReportQuestion={() => handleReportQuestion(index)}
          />
          {(quizSubmitted || reportedQuestions[index]) && question.explanation && (
            <div className="mt-4 p-4 bg-yellow-100 rounded-md">
              <p className="text-yellow-800">{question.explanation}</p>
            </div>
          )}
          {reportedQuestions[index] && (
            <div className="mt-4 p-4 bg-red-100 rounded-md">
              <p className="text-red-800">This question has been temporarily removed from scoring pending review by our team.</p>
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
        <div className="mt-8 text-center space-x-3">
          <button
            onClick={handleSubmitQuiz}
            className="w-32 mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Quiz
          </button>
          <button
            onClick={() => onExitQuiz()}
            className="w-32 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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
            onClick={() => onExitQuiz()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Exit Quiz
          </button>
          {!isContinue &&
            <button
              onClick={() => onNextQuiz()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Next Quiz
            </button>}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuiz;