import React, { useState, useEffect, useCallback } from 'react';
import MultipleChoiceQuiz from './components/MultipleChoiceQuiz';
import { get_random_quiz_data } from './db';

const App = () => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuizData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await get_random_quiz_data(50);
      setQuizData(data);
      setError(null);
    } catch (e) {
      console.error('There was a problem fetching the quiz data:', e);
      setError('Failed to load quiz data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleNextQuiz = useCallback(async () => {
    await fetchQuizData();
    window.scrollTo(0, 0);
  }, [fetchQuizData]);

  if (isLoading) {
    return <div className="text-center mt-8">Loading quiz data...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Japanese Quiz</h1>
      {quizData ? (
        <MultipleChoiceQuiz 
          quizData={quizData} 
          onNextQuiz={handleNextQuiz} 
        />
      ) : (
        <div className="text-center mt-8">No quiz data available.</div>
      )}
    </div>
  );
};

export default App;