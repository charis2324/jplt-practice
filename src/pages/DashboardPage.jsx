import { useEffect, useState } from "react";
// import { get_user_stats } from "../db";
import Dashboard from "../components/DashBoard";

function DashboardPage() {
    const [userStats, setUserStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {

        const getUserStats = async () => {
            try {
                setIsLoading(true)
                const stats = await get_user_stats();
                setUserStats(stats);
            } catch (error) {
                console.error("Failed to fetch user stats:", error);
            } finally {
                setIsLoading(false)
            }
        };

        getUserStats();
    }, []);

    return <Dashboard userStats={userStats} isLoading={isLoading} />;
}

export default DashboardPage;