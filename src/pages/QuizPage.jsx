import React, { useState, useCallback, useContext } from 'react';
import MultipleChoiceQuiz from '../components/MultipleChoiceQuiz';
import QuizConfigurator from '../components/QuizConfigurator';
import QuestionInstruction from '../components/QuestionInstruction';
import { get_new_quiz } from '../db';
import { AuthContext } from '../contexts/AuthContext';

const QuizPage = () => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizConfig, setQuizConfig] = useState({ questionCount: 10, jlptLevel: 5 });
  const [quizStarted, setQuizStarted] = useState(false);
  const {user} = useContext(AuthContext);

  const fetchQuizData = useCallback(async () => {
    setIsLoading(true);
    try {
      const newQuizData = await get_new_quiz(quizConfig.questionCount, quizConfig.jlptLevel, user.id);
      setQuizData(newQuizData);
      setError(null);
      setQuizStarted(true);
    } catch (e) {
      console.error('There was a problem fetching the quiz data:', e);
      setError('Failed to load quiz data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [quizConfig.questionCount, quizConfig.jlptLevel]);

  const handleNextQuiz = useCallback(async () => {
    await fetchQuizData();
    window.scrollTo(0, 0);
  }, [fetchQuizData]);

  const handleConfigChange = (newConfig) => {
    setQuizConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  };

  const handleStart = () => {
    setQuizStarted(false);
    setQuizData(null);
    fetchQuizData();
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading quiz data...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">JLPT Quiz</h1>
      {!quizStarted && (
        <div className='lg:flex lg:flex-row-reverse lg:items-center'>
          <div className='lg:w-1/2'>
          <QuizConfigurator
            onConfigChange={handleConfigChange}
            currentConfig={quizConfig}
            onStart={handleStart}
          />
          </div>
          <div className='lg:w-1/2'>
          <QuestionInstruction />
          </div>
        </div>
      )}
      {quizStarted && quizData ? (
        <MultipleChoiceQuiz
          quizData={quizData}
          onNextQuiz={handleNextQuiz}
        />
      ) : null}
    </div>
  );
};

export default QuizPage;