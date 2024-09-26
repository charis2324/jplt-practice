import React from 'react';

const QuizConfigurator = ({ onConfigChange, currentConfig, onStart }) => {
  const options = [5, 10, 30, 50];
  const handleJLPTLevelCHange = (e) => {
    onConfigChange({ ...currentConfig, jlptLevel: Number(e.target.value) })
  }

  return (
    <div className="max-w-md mx-auto mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Quiz Configuration</h2>
      <label htmlFor="questionCount" className="block mb-2 font-bold">
        Number of Questions:
      </label>
      <select
        id="questionCount"
        value={currentConfig.questionCount}
        onChange={(e) => onConfigChange({ questionCount: Number(e.target.value) })}
        className="w-full p-2 border rounded mb-4"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <fieldset>
        <legend className="block mb-2 font-bold">JLPT Level:</legend>
        <div className="w-full p-2 rounded mb-4 space-x-2">
          <label htmlFor="JLPTN5">N5</label>
          <input type="radio" name="JLPTLevel" id="JLPTN5" value="5" checked={currentConfig.jlptLevel === 5} onChange={handleJLPTLevelCHange} />
          <label htmlFor="JLPTN4">N4</label>
          <input type="radio" name="JLPTLevel" id="JLPTN4" value="4" checked={currentConfig.jlptLevel === 4} onChange={handleJLPTLevelCHange} />
        </div>
      </fieldset>
      <button
        onClick={onStart}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default QuizConfigurator;