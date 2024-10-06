import { useMemo } from 'react';
import StatsCard from "./StatsCard";
import StatsCardWithQuestion from './StatsCardWithQuestion';
import LoadingIndicator from './LoadingIndicator';

const Dashboard = ({ userStats, keyQuestions, isLoading }) => {
    const parseQuestionDetails = (questionData, userAnswer = null) => {
        if (!questionData) return null;
        return {
            questionText: questionData.question_text,
            options: questionData.options,
            correctAnswer: questionData.correct_answer?.value,
            selectedOption: userAnswer?.value || null
        };
    };

    const formatUnit = (value, single, plural) => {
        if (value === null || value === undefined) return null;
        return `${value} ${value === 1 || value === 0 ? single : plural}`;
    };

    // Memoize the stats to prevent unnecessary computations
    const stats = useMemo(() => {
        if (!userStats) return [];

        const {
            quizzes_completed,
            total_questions_completed,
            distinct_questions_completed,
            correct_answers,
            accuracy_percentage,
            first_try_success_percentage,
            avg_answer_time,
            current_streak,
            best_streak,
            avg_jlpt_level
        } = userStats;

        return [
            {
                title: "Quizzes Completed",
                value: quizzes_completed,
                description: "Milestones achieved"
            },
            {
                title: "Total Questions",
                value: total_questions_completed,
                description: "Your journey in numbers"
            },
            {
                title: "Distinct Questions",
                value: distinct_questions_completed,
                description: "Variety in your learning"
            },
            {
                title: "Correct Answers",
                value: correct_answers,
                description: "Your triumphs"
            },
            {
                title: "Accuracy %",
                value: accuracy_percentage ? `${accuracy_percentage}%` : null,
                description: "Your precision"
            },
            {
                title: "First Try Success %",
                value: first_try_success_percentage ? `${first_try_success_percentage}%` : null,
                description: "Your initial accuracy"
            },
            {
                title: "Avg. Answer Time",
                value: avg_answer_time ? `${avg_answer_time}s` : null,
                description: "Your swiftness"
            },
            {
                title: "Current Streak",
                value: formatUnit(current_streak, 'day', 'days'),
                description: "Your momentum"
            },
            {
                title: "Best Streak",
                value: formatUnit(best_streak, 'day', 'days'),
                description: "Your personal best"
            },
            {
                title: "Avg. JLPT Level",
                value: avg_jlpt_level ? `N${avg_jlpt_level.toFixed(2)}` : null,
                description: "Your current challenge"
            }
        ];
    }, [userStats]);

    // Memoize the question stats to prevent unnecessary computations
    const questionStats = useMemo(() => {
        if (!keyQuestions) return [];

        const {
            most_recent_erroneous_question_data,
            most_recent_erroneous_user_answer,
            most_frequent_erroneous_question_data,
            frequency
        } = keyQuestions;

        const statsArray = [];

        if (most_recent_erroneous_question_data) {
            statsArray.push({
                title: 'Recent Error',
                value: null,
                questionDetails: parseQuestionDetails(most_recent_erroneous_question_data, most_recent_erroneous_user_answer),
                isNegative: true
            });
        }

        if (most_frequent_erroneous_question_data) {
            statsArray.push({
                title: 'Most Frequent Error',
                value: formatUnit(frequency, 'time', 'times'),
                questionDetails: parseQuestionDetails(most_frequent_erroneous_question_data),
                isNegative: true
            });
        }
        return statsArray;
    }, [keyQuestions]);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <LoadingIndicator />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-center">Dashboard</h1>
                {/* User Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <StatsCard key={stat.title} {...stat} />
                    ))}
                </div>
                {/* Key Questions Stats */}
                <div className="mt-8 space-y-6">
                    {questionStats.map((qs) => (
                        <StatsCardWithQuestion key={qs.title} {...qs} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;