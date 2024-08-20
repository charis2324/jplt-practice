import QuizHistoryList from "../components/QuizHistoryList";
import { get_user_quiz_sessions_history } from "../db";
import { useState, useEffect } from "react";
function QuizHistoryPage(){
    const [quizSessionsHistory, setQuizSessionsHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {

        const getQuizSessionsHistory = async () => {
            try {
                setIsLoading(true)
                const stats = await get_user_quiz_sessions_history(0);
                setQuizSessionsHistory(stats);
            } catch (error) {
                console.error("Failed to fetch user stats:", error);
            }finally{
                setIsLoading(false)
            }
        };

        getQuizSessionsHistory();
    }, []);
    return (
        <div>
            <QuizHistoryList quizSessionsHistory={quizSessionsHistory} isLoading={isLoading}/>    
        </div>
    )
}

export default QuizHistoryPage;