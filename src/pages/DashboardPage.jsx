// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { getKeyMetrics, getKeyQuestionsDetails } from "../db";
import Dashboard from "../components/DashBoard";

const DashboardPage = () => {
    const [userStats, setUserStats] = useState({});
    const [keyQuestions, setKeyQuestions] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const stats = await getKeyMetrics();
                const questions = await getKeyQuestionsDetails();
                setUserStats(stats);
                setKeyQuestions(questions);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Dashboard
            userStats={userStats}
            keyQuestions={keyQuestions}
            isLoading={isLoading}
        />
    );
};

export default DashboardPage;