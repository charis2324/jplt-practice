import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuizSessionResult } from "../db";
import LoadingIndicator from "../components/LoadingIndicator";
import Quiz from "../components/Quiz";

function QuizSessionResultPage() {
    const { quizSessionId } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchQuizSession = async () => {
            setIsLoading(true)
            try {
                const data = await getQuizSessionResult(quizSessionId);
                if (data) {
                    setQuizData(data);
                } else {
                    setError('Quiz session not found.');
                }
            } catch (err) {
                console.error('Error fetching quiz session:', err);
                setError('Failed to load quiz session data.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchQuizSession();
    }, [quizSessionId, setQuizData])

    const handleExitQuiz = () => {
        navigate('/history')
    }

    if (isLoading) {
        return (
            <div className="text-center mt-8">
                <LoadingIndicator />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-8 text-red-600">
                {error}
            </div>
        );
    }

    if (!quizData) {
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Quiz Results</h1>
            <Quiz
                quizData={quizData}
                isContinue={false}
                onExitQuiz={handleExitQuiz}
                readOnly={true} // Enable read-only mode
            />
        </div>
    );
}

export default QuizSessionResultPage;