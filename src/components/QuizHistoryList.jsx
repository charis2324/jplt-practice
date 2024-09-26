import QuizHistoryEntry from "./QuizHistoryEntry";
import LoadingIndicator from "./LoadingIndicator";

function QuizHistoryList({ quizSessionsHistory, isLoading }) {
    const sessionHistory = quizSessionsHistory?.sessions
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <LoadingIndicator />
                </div>
            </div>
        );
    }
    console.log(sessionHistory)
    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-center">History</h1>
                <div className="bg-white rounded-lg p-6 shadow-md">
                    {sessionHistory?.map((hist, index) => (
                        <QuizHistoryEntry key={hist.quiz_session_id} index={index} correctAnswers={hist.correct_answers} totalQuestions={hist.active_questions} quizDatetime={hist.created_at} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuizHistoryList;