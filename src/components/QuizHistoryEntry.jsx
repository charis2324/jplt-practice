import { convertToLocalTimezone } from "../utils";

function QuizHistoryEntry({index, correctAnswers, totalQuestions, quizDatetime}) {
    console.log(quizDatetime)
    const localDateTime = convertToLocalTimezone(quizDatetime);

    const scorePercentage = ((correctAnswers / totalQuestions) * 100).toFixed(0);

    return (
        <div className={`max-w-full flex flex-col p-4 border-x border-b ${index === 0 ? 'border-t' : ''}`}>
            {/* Date and Time */}
            <div className="text-gray-600 text-sm mb-2">
                {localDateTime}
            </div>
            {/* Quiz Results */}
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
                <div className="w-full sm:w-20 flex justify-start items-center mb-2 sm:mb-0">
                    <span className="font-semibold text-gray-700">Correct</span>
                    <span className="font-bold text-2xl text-green-600 ml-2">{correctAnswers}</span>
                </div>
                <div className="w-full sm:w-20 flex justify-start items-center mb-2 sm:mb-0">
                    <span className="font-semibold text-gray-700">Total</span>
                    <span className="font-bold text-2xl ml-2">{totalQuestions}</span>
                </div>
                {/* Score Percentage */}
                <div className="w-full sm:w-32 flex justify-start items-center mb-2 sm:mb-0">
                    <span className="font-semibold text-gray-700">Score</span>
                    <span className="font-bold text-xl text-blue-500 ml-2">{scorePercentage}%</span>
                </div>
            </div>
        </div>
    );
}

export default QuizHistoryEntry;