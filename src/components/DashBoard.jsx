import { useCallback, useMemo } from 'react';
import StatsCard from "./StatsCard";
import StatsCardWithQuestion from './StatsCardWithQuestion';
import LoadingIndicator from './LoadingIndicator';

function Dashboard({ userStats, keyQuestions, isLoading }) {
    console.log(keyQuestions);

    const parseQuestionDetails = (q, r = null) => {
        if (!q) return null;
        return {
            questionText: q.question_text,
            options: q.options,
            correctAnswer: q.correct_answer?.value,
            selectedOption: r?.value
        };
    };

    const formatUnit = (value, single, plural) => {
        if (value === null || value === undefined) return null;
        return `${value} ${value === 1 || value === 0 ? single : plural}`;
    };

    const formatDays = useCallback((value) => formatUnit(value, 'day', 'days'), []);
    const formatTimes = useCallback((value) => formatUnit(value, 'time', 'times'), []);

    const stats = useMemo(() => [
        {
            title: "Quizzes Completed",
            value: userStats?.quizzes_completed,
            description: "Milestones achieved"
        },
        {
            title: "Total Questions",
            value: userStats?.total_questions_completed,
            description: "Your journey in numbers"
        },
        {
            title: "Distinct Questions",
            value: userStats?.distinct_questions_completed,
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
            value: userStats?.avg_answer_time ? `${userStats.avg_answer_time}s` : null,
            description: "Your swiftness"
        },
        {
            title: "Current Streak",
            value: formatDays(userStats?.current_streak),
            description: "Your momentum"
        },
        {
            title: "Best Streak",
            value: formatDays(userStats?.best_streak),
            description: "Your personal best"
        },
        {
            title: "Avg. JLPT Level",
            value: userStats?.avg_jlpt_level ? `N${userStats.avg_jlpt_level.toFixed(2)}` : null,
            description: "Your current challenge"
        }
    ], [formatDays, userStats.accuracy_percentage, userStats.avg_answer_time, userStats.avg_jlpt_level, userStats?.best_streak, userStats?.correct_answers, userStats?.current_streak, userStats?.distinct_questions_completed, userStats.first_try_success_percentage, userStats?.quizzes_completed, userStats?.total_questions_completed]);

    const questionStats = useMemo(() => {
        const mostRecentErroneousQuestion = keyQuestions?.most_recent_erroneous_question_data;
        const mostRecentErroneousQuestionUserAnswer = keyQuestions?.most_recent_erroneous_user_answer;
        const mostFrequentErroneousQuestion = keyQuestions?.most_frequent_erroneous_question_data;
        const result = [mostRecentErroneousQuestion ?
            {
                title: 'Recent Error',
                value: null,
                questionDetails: parseQuestionDetails(mostRecentErroneousQuestion, mostRecentErroneousQuestionUserAnswer),
                isNegative: true
            } : null,
        mostFrequentErroneousQuestion ? {
            title: 'Most Frequent Error',
            value: formatTimes(keyQuestions.frequency),
            questionDetails: parseQuestionDetails(mostFrequentErroneousQuestion),
            isNegative: true
        } : null
        ];
        console.log(result)
        return result;
    }, [formatTimes, keyQuestions.frequency, keyQuestions?.most_frequent_erroneous_question_data, keyQuestions?.most_recent_erroneous_question_data, keyQuestions?.most_recent_erroneous_user_answer]);

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
}

export default Dashboard;