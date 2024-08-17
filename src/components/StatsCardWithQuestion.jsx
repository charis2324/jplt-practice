import MultipleChoiceQuestion from "./MultipleChoiceQuestion";

function StatsCardWithQuestion({title, value, questionDetails, isNegative = false}){
    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex flex-wrap flex-row justify-between">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
                {value && <div className={`text-3xl font-bold ${isNegative ? 'text-orange-600' : 'text-blue-600'} mb-2 text-right`}>{value}</div>}
            </div>
            <MultipleChoiceQuestion {...questionDetails} showCorrectAnswer={true} showReportBtn={false} showShadow={false} useSpacing={false}/>
        </div>
    )
}

export default StatsCardWithQuestion;