import { useState, useCallback, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Quiz from '../components/Quiz';
import QuizConfigurator from '../components/QuizConfigurator';
import QuestionInstruction from '../components/QuestionInstruction';
import { getLatestInProgressSession, initializeQuizSession, continueQuizSession } from '../db';
import { AuthContext } from '../contexts/AuthContext';
import QuizContinue from '../components/QuizContinue';
import LoadingIndicator from '../components/LoadingIndicator';

const QuizPage = () => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizConfig, setQuizConfig] = useState({ questionCount: 5, jlptLevel: 4 });
  const [quizStarted, setQuizStarted] = useState(false);
  const [inProgressQuizSessionId, setInProgressQuizSessionId] = useState(null);
  const [isContinue, setIsContinue] = useState(false);
  const { user } = useContext(AuthContext);

  const getInProgressQuizSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const sessionId = await getLatestInProgressSession();
      console.log(`In-progress session Id: ${sessionId}`);
      setInProgressQuizSessionId(sessionId);
    } catch (error) {
      setInProgressQuizSessionId(null);
      console.error('Error:', error.message);
    }
    setIsLoading(false);
  }, []);

  const hasQuizInProgress = inProgressQuizSessionId !== null;

  // Access state from <Link>
  const location = useLocation();
  // Reset state when resetQuiz is true
  useEffect(() => {
    if (location.state && location.state.resetQuiz) {
      setQuizData(null);
      setError(null);
      getInProgressQuizSession();
      setQuizConfig({ questionCount: 10, jlptLevel: 5 });
      setQuizStarted(false);
      setIsContinue(false);

      // Avoids potential re-renders caused by location state changes
      window.history.replaceState({}, document.title);
    }
  }, [getInProgressQuizSession, location.state]);

  useEffect(() => {
    getInProgressQuizSession();
  }, [getInProgressQuizSession]);

  const fetchQuizData = useCallback(
    async (is_new_quiz) => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedQuizData = await (is_new_quiz
          ? initializeQuizSession(quizConfig.jlptLevel, quizConfig.questionCount)
          : continueQuizSession());
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
    },
    [quizConfig.questionCount, quizConfig.jlptLevel]
  );

  const handleNextQuiz = useCallback(async () => {
    await fetchQuizData(true);
    window.scrollTo(0, 0);
  }, [fetchQuizData]);

  const handleConfigChange = (newConfig) => {
    setQuizConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  };

  const handleStart = () => {
    setIsContinue(false);
    setQuizStarted(false);
    setQuizData(null);
    fetchQuizData(true);
  };
  const handleContinue = () => {
    setIsContinue(true);
    setQuizStarted(false);
    setQuizData(null);
    fetchQuizData(false);
  };
  const handleExitQuiz = () => {
    getInProgressQuizSession(user.id);
    setQuizStarted(false);
    setQuizData(null);
  };
  if (isLoading) {
    return (
      <div className="text-center mt-8">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">JLPT Quiz</h1>
      {!quizStarted && (
        <div className="lg:flex lg:flex-row-reverse lg:items-center">
          <div className="lg:w-1/2">
            {hasQuizInProgress && <QuizContinue onContinue={handleContinue} />}
            <QuizConfigurator
              onConfigChange={handleConfigChange}
              currentConfig={quizConfig}
              onStart={handleStart}
            />
          </div>
          <div className="lg:w-1/2">
            <QuestionInstruction />
          </div>
        </div>
      )}
      {quizStarted && quizData ? (
        <Quiz
          quizData={quizData}
          isContinue={isContinue}
          onNextQuiz={handleNextQuiz}
          onExitQuiz={handleExitQuiz}
        />
      ) : null}
    </div>
  );
};

export default QuizPage;