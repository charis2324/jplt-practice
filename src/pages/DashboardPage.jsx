import { useEffect, useState } from "react";
import { getKeyMetrics, getKeyQuestionsDetails } from "../db";
import Dashboard from "../components/DashBoard";

function DashboardPage() {
    const [userStats, setUserStats] = useState({});
    const [keyQuestions, setKeyQuestions] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {

        const getDashboardInfo = async () => {
            try {
                setIsLoading(true)
                const stats = await getKeyMetrics();
                const questions = await getKeyQuestionsDetails();
                setUserStats(stats);
                setKeyQuestions(questions);
            } catch (error) {
                console.error("Failed to fetch dashboard: ", error);
            } finally {
                setIsLoading(false)
            }
        };

        getDashboardInfo();
    }, []);

    return <Dashboard userStats={userStats} keyQuestions={keyQuestions} isLoading={isLoading} />;
}

export default DashboardPage;