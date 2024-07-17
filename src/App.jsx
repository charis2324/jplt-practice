import React, { useState, useCallback } from 'react';
import MultipleChoiceQuiz from './components/MultipleChoiceQuiz';
import QuizConfigurator from './components/QuizConfigurator';
import { get_random_quiz_data } from './db';

const App = () => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizConfig, setQuizConfig] = useState({ questionCount: 10 });
  const [quizStarted, setQuizStarted] = useState(false);

  const fetchQuizData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await get_random_quiz_data(quizConfig.questionCount);
      setQuizData(data);
      setError(null);
      setQuizStarted(true);
    } catch (e) {
      console.error('There was a problem fetching the quiz data:', e);
      setError('Failed to load quiz data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [quizConfig.questionCount]);

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
        <QuizConfigurator 
          onConfigChange={handleConfigChange} 
          currentConfig={quizConfig} 
          onStart={handleStart}
        />
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

export default App;