import React, { useState, useEffect } from 'react';
import MultipleChoiceQuiz from './components/MultipleChoiceQuiz';

const App = () => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/charis2324/jlpt/main/mc/01.json'
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuizData(data);
        setIsLoading(false);
      } catch (e) {
        console.error('There was a problem fetching the quiz data:', e);
        setError('Failed to load quiz data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, []);

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
        <MultipleChoiceQuiz quizData={quizData} />
      ) : (
        <div className="text-center mt-8">No quiz data available.</div>
      )}
    </div>
  );
};

export default App;
