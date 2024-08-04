import React, { useState, useCallback, useContext, useEffect } from 'react';
import MultipleChoiceQuiz from '../components/MultipleChoiceQuiz';
import QuizConfigurator from '../components/QuizConfigurator';
import QuestionInstruction from '../components/QuestionInstruction';
import { get_new_quiz, get_in_progress_quiz,has_quiz_in_progress } from '../db';
import { AuthContext } from '../contexts/AuthContext';
import QuizContinue from '../components/QuizContinue';

const QuizPage = () => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizConfig, setQuizConfig] = useState({ questionCount: 10, jlptLevel: 5 });
  const [quizStarted, setQuizStarted] = useState(false);
  const [hasQuizInProgress, setHasQuizInProgress] = useState(true);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const checkQuizProgress = async () => {
        setIsLoading(true);
        const has_quiz = await has_quiz_in_progress(user.id);
        setIsLoading(false);
        console.log('has_quiz: ', has_quiz);
        setHasQuizInProgress(has_quiz);
    };
    checkQuizProgress();
}, [user.id]);

  // const fetchQuizData = useCallback(async (is_new_quiz) => {
  //   setIsLoading(true);
  //   try {
  //     const fetchedQuizData = null;
  //     if(is_new_quiz){
  //       fetchedQuizData = await get_new_quiz(quizConfig.questionCount, quizConfig.jlptLevel, user.id);
  //     }
  //     else{
  //       fetchedQuizData = await get_in_progress_quiz(user.id);
  //     }
  //     setQuizData(fetchedQuizData);
  //     setError(null);
  //     setQuizStarted(true);
  //   } catch (e) {
  //     console.error('There was a problem fetching the quiz data:', e);
  //     setError('Failed to load quiz data. Please try again later.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [quizConfig.questionCount, quizConfig.jlptLevel]);
  const fetchQuizData = useCallback(async (is_new_quiz) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const fetchedQuizData = await (is_new_quiz 
        ? get_new_quiz(quizConfig.questionCount, quizConfig.jlptLevel, user.id)
        : get_in_progress_quiz(user.id));
  
      if (!fetchedQuizData) {
        throw new Error('No quiz data received');
      }
  
      setQuizData(fetchedQuizData);
      setQuizStarted(true);
    } catch (e) {
      console.error('There was a problem fetching the quiz data:', e);
      setError('Failed to load quiz data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [quizConfig.questionCount, quizConfig.jlptLevel, user.id]);

  const handleNextQuiz = useCallback(async () => {
    await fetchQuizData(true);
    window.scrollTo(0, 0);
  }, [fetchQuizData]);

  const handleConfigChange = (newConfig) => {
    setQuizConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  };

  const handleStart = () => {
    setQuizStarted(false);
    setQuizData(null);
    fetchQuizData(true);
  };
  const handleContinue = () => {
    setQuizStarted(false);
    setQuizData(null);
    fetchQuizData(false);
  }
  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
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
          {hasQuizInProgress && <QuizContinue onContinue={handleContinue}/>}
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