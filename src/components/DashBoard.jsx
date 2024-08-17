import React, { useMemo } from 'react';
import StatsCard from "./StatsCard";
import StatsCardWithQuestion from './StatsCardWithQuestion';

const Dashboard = ({ userStats, isLoading }) => {
    console.log(userStats);

    const parseQuestionDetails = (q) => {
        if (!q) return null;
        return {
            id: q.id,
            question: q.question_text,
            options: {
                A: q.option_a,
                B: q.option_b,
                C: q.option_c,
                D: q.option_d
            },
            correctAnswer: q.correct_answer,
            selectedOption: q.response_answer
        };
    };

    const formatUnit = (value, single, plural) => {
        if (value === null || value === undefined) return null;
        return `${value} ${value === 1 || value === 0 ? single : plural}`;
    };

    const formatDays = (value) => formatUnit(value, 'day', 'days');
    const formatTimes = (value) => formatUnit(value, 'time', 'times');

    const stats = useMemo(() => [
        {
            title: "Quizzes Completed",
            value: userStats?.quizzes_completed,
            description: "Milestones achieved"
        },
        {
            title: "Total Questions",
            value: userStats?.total_questions,
            description: "Your journey in numbers"
        },
        {
            title: "Distinct Questions",
            value: userStats?.total_distinct_questions,
            description: "Variety in your learning"
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
            title: "First Try Success %",
            value: userStats?.first_try_success_percentage ? `${userStats.first_try_success_percentage}%` : null,
            description: "Your initial accuracy"
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
        {
            title: "Avg. JLPT Level",
            value: userStats?.average_jlpt_level ? `N${userStats.average_jlpt_level.toFixed(2)}` : null,
            description: "Your current challenge"
        }
    ], [userStats]);

    const questionStats = useMemo(() => {
        const mostIncorrectQuestion = userStats?.most_incorrect_question;
        const lastest_random_active_incorrect_question = userStats?.lastest_random_active_incorrect_question
        return mostIncorrectQuestion ? [
            {
                title: 'Recent Error',
                value: null,
                questionDetails: parseQuestionDetails(lastest_random_active_incorrect_question),
                isNegative: true
            },
            {
                title: 'Most Frequent Error',
                value: formatTimes(userStats.most_incorrect_question_incorrect_count),
                questionDetails: parseQuestionDetails(mostIncorrectQuestion),
                isNegative: true
            },
        ] : [];
    }, [userStats]);

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
            <div className="max-w-7xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-center">Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <StatsCard key={stat.title} {...stat} />
                    ))}
                </div>
                {questionStats.map((qs) => (
                    <StatsCardWithQuestion key={qs.title} {...qs} />
                ))}
            </div>
        </div>
    );
};

export default React.memo(Dashboard);