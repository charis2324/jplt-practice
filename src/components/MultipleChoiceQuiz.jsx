import React, { useContext, useEffect, useState } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import { report_question, update_user_quiz_answer, submit_user_quiz_answers } from '../db';
import { AuthContext } from '../contexts/AuthContext';



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

  useEffect(()=>{
    console.log('session_id: ', session_id)
  }, [session_id])
  useEffect(()=>{
    console.log('quiz_id', quiz_id)
  }, [quiz_id])
  useEffect(()=>{
    console.log('selectedAnswers:', selectedAnswers)
  }, [selectedAnswers])
  useEffect(()=>{
    console.log('reportedQuestions:', reportedQuestions)
  }, [reportedQuestions])

  const handleAnswerSelect = (questionIndex, answer) => {
    if (!quizSubmitted) {
      console.log('questionIndex:', questionIndex)
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[questionIndex] = answer;
      setSelectedAnswers(newSelectedAnswers);
      setError(null);
      update_user_quiz_answer(questionIndexToId[questionIndex], session_id, answer)
    }
  };
  const submitResult = () => {
    const finalSessionResponses = quizData.questions.map((q, index) => {
      return {
        question_id: q.id,
        response_answer: selectedAnswers[index],
        is_reported: reportedQuestions[index]
      }
    })
    try {
      const submitedQuizSessionResponses = submit_user_quiz_answers(session_id, {
        session_responses: finalSessionResponses
      });
    }catch (e) {
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
    const newReportedQuestions = [...reportedQuestions]
    newReportedQuestions[questionIndex] = true;
    setReportedQuestions(newReportedQuestions);
    setError(null)
    report_question(session_id, questionIndexToId[questionIndex]);
    console.log('handleReportQuestion questionId: ', questionIndexToId[questionIndex])
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      if (reportedQuestions[index]) return score;
      return score + (answer === quizData.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const validQuestionCount = quizData.questions.length - reportedQuestions.reduce((sum, rq) => {return rq ? sum + 1 : sum}, 0);
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