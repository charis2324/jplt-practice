import React from 'react';
import StatsCard from "./StatsCard";

const Dashboard = ({ userStats, isLoading }) => {
    const formatDays = (value) => {
        if (value === null || value === undefined) return null;
        if (value === 0) return "0 days";
        return `${value} ${value === 1 ? 'day' : 'days'}`;
    };

    const stats = React.useMemo(() => [
        { 
            title: "Total Questions", 
            value: userStats?.total_questions, 
            description: "Your journey in numbers" 
        },
        { 
            title: "Correct Answers", 
            value: userStats?.correct_answers, 
            description: "Your triumphs" 
        },
        { 
            title: "Accuracy %", 
            value: userStats?.accuracy_percentage ? `${userStats.accuracy_percentage}%` : null, 
            description: "Your precision" 
        },
        { 
            title: "Quizzes Completed", 
            value: userStats?.quizzes_completed, 
            description: "Milestones achieved" 
        },
        { 
            title: "Avg. JLPT Level", 
            value: userStats?.average_jlpt_level ? `N${userStats.average_jlpt_level}` : null, 
            description: "Your current challenge" 
        },
        { 
            title: "Avg. Answer Time", 
            value: userStats?.average_answer_second ? `${userStats.average_answer_second}s` : null, 
            description: "Your swiftness" 
        },
        { 
            title: "Current Streak", 
            value: formatDays(userStats?.current_streak), 
            description: "Your momentum" 
        },
        { 
            title: "Best Streak", 
            value: formatDays(userStats?.highest_streak), 
            description: "Your personal best" 
        },
    ], [userStats]);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <p className="text-center">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <StatsCard key={stat.title} {...stat} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(Dashboard);