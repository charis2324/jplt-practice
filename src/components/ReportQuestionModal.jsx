import { useCallback, useState } from "react";
import { reportQuestionBySessionAnswer } from "../db";
import LoadingIndicator from "./LoadingIndicator";
import PropTypes from 'prop-types';

const ReportQuestionModal = ({ quizSessionAnswerId, isOpen, onClose, onReportSuccess, questionText }) => {
    const [reason, setReason] = useState('');
    const [isReporting, setIsReporting] = useState(false);
    const [reportError, setReportError] = useState(null);

    const handleSubmit = async () => {
        try {
            setReportError(null);
            setIsReporting(true);
            await reportQuestionBySessionAnswer(quizSessionAnswerId);
            onReportSuccess?.(reason);
            handleClose();
        } catch (e) {
            setReportError(e.message);
        } finally {
            setIsReporting(false);
        }
    };

    const handleClose = useCallback(() => {
        setReportError(null);
        setReason('');
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md mx-auto p-6">
                <h2 className="text-xl font-semibold mb-4">Report Question</h2>
                {questionText && (
                    <p className="rounded-md mb-4 p-2 bg-gray-300 w-full truncate">{questionText}</p>
                )}
                <p className="mb-2 text-pretty">Please provide a reason for reporting this question:</p>
                <textarea
                    className="w-full p-2 border resize-none border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain the issue..."
                />
                {reportError && <p className="text-red-800 text-xs font-bold">{reportError}</p>}
                <div className="flex justify-end mt-4">
                    <div className="space-x-2 w-44">
                        {!isReporting ? (
                            <>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                                >
                                    Submit
                                </button>
                            </>
                        ) : (
                            <div className="py-2"><LoadingIndicator sizeRem={1.5} /></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ReportQuestionModal.propTypes = {
    quizSessionAnswerId: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onReportSuccess: PropTypes.func,
    questionText: PropTypes.string
};

export default ReportQuestionModal;