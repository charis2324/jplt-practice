import QuizHistoryEntry from "./QuizHistoryEntry";
import LoadingIndicator from "./LoadingIndicator";

function QuizHistoryList({ quizHistory, isLoading }) {
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <LoadingIndicator />
                </div>
            </div>
        );
    }
    console.log(quizHistory)
    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-center">History</h1>
                <div className="bg-white rounded-lg p-6 shadow-md">
                    {quizHistory?.map((hist, index) => (
                        <QuizHistoryEntry key={hist.quiz_session_id} index={index} correctAnswers={hist.num_correct_questions} totalQuestions={hist.num_active_questions} quizDatetime={hist.submit_time} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuizHistoryList;