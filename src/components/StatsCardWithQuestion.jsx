import React from 'react';
import PropTypes from 'prop-types';
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";

// eslint-disable-next-line react-refresh/only-export-components
function StatsCardWithQuestion({ title, value, questionDetails, isNegative = false }) {
    if (!questionDetails) return null;

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex flex-wrap flex-row justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                {value && (
                    <div className={`text-3xl font-bold ${isNegative ? 'text-orange-600' : 'text-blue-600'} mb-2 text-right`}>
                        {value}
                    </div>
                )}
            </div>
            <MultipleChoiceQuestion
                showCorrectAnswer={true}
                showReportBtn={false}
                showShadow={false}
                useSpacing={false}
                {...questionDetails}
            />
        </div>
    );
}

StatsCardWithQuestion.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    questionDetails: PropTypes.shape({
        questionText: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                option_id: PropTypes.string.isRequired,
                text: PropTypes.string.isRequired,
            })
        ).isRequired,
        correctAnswer: PropTypes.string.isRequired,
        selectedOption: PropTypes.string,
    }),
    isNegative: PropTypes.bool
};

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(StatsCardWithQuestion);