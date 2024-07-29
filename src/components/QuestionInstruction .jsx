import React, { useState } from 'react';

const QuestionInstruction = () => {
  const [showEnglish, setShowEnglish] = useState(true);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{!showEnglish ? "指示" : "Instructions"}</h2>
        <button
          onClick={() => setShowEnglish(!showEnglish)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          {showEnglish ? '日本語で表示' : 'Show in English'}
        </button>
      </div>

      <div className="h-[400px] overflow-y-auto">
        <div className="mb-4 text-gray-700 h-28">
          {!showEnglish ? (
            <p>
              以下の文章の空欄に入る最も適切な言葉を選んでください。選択肢が辞書形（じしょけい）で示されている場合は、文脈に合わせて適切な活用形を考えてください。
            </p>
          ) : (
            <p>
              Choose the most appropriate word to fill in the blank in the following sentence. 
              When options are given in jishokei (dictionary form), consider the appropriate 
              conjugation that fits the context of the sentence.
            </p>
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {showEnglish ? 'Example:' : '例：'}
        </h3>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="mb-2 text-gray-800">私は毎日朝7時に家を＿＿＿ます。</p>
          {showEnglish && <p className="mb-2 text-gray-600">(I _____ home every day at 7 am.)</p>}
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>A. 出る {showEnglish && '(deru: to leave)'}</li>
            <li>B. 差す {showEnglish && '(sasu: to shine, to point)'}</li>
            <li>C. 書く {showEnglish && '(kaku: to write)'}</li>
            <li>D. 吐く {showEnglish && '(haku: to vomit, to exhale)'}</li>
          </ul>
          <p className="font-semibold text-gray-800">
            {showEnglish ? 'Correct answer:' : '正解：'} A. 出る （
            {showEnglish ? 'Correct conjugation:' : '正しい活用形：'} 出ます
            {showEnglish && ' - demasu'}）
          </p>
        </div>
        
        <p className="mt-4 text-sm text-gray-600">
          {showEnglish 
            ? 'Note: This example shows options in jishokei. Some questions may have options in different forms.' 
            : '注：この例では選択肢が辞書形で示されていますが、問題によっては異なる形で提示される場合があります。'}
        </p>
      </div>
    </div>
  );
};

export default QuestionInstruction;