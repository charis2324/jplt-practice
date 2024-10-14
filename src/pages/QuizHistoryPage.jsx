import QuizHistoryList from "../components/QuizHistoryList";
import { getQuizHistory } from "../db";
import { useState, useEffect } from "react";
function QuizHistoryPage() {
    const [quizHistory, setQuizHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {

        const getQuizSessionsHistory = async () => {
            try {
                setIsLoading(true)
                const quizHistoryResponse = await getQuizHistory();
                setQuizHistory(quizHistoryResponse.quiz_history);
            } catch (error) {
                console.error("Failed to fetch user stats:", error);
            } finally {
                setIsLoading(false)
            }
        };

        getQuizSessionsHistory();
    }, []);
    return (
        <div>
            <QuizHistoryList quizHistory={quizHistory} isLoading={isLoading} />
        </div>
    )
}

export default QuizHistoryPage;