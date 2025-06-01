import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';

// Interfaces based on aiService.ts in backend
interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface ShortAnswerQuestion {
  question: string;
  idealAnswer: string;
  keywords?: string[];
}

interface LongAnswerQuestion {
  question: string;
  guidelines?: string;
}

interface QuestionBank {
  mcqs: MCQ[];
  shortAnswerQuestions: ShortAnswerQuestion[];
  longAnswerQuestions: LongAnswerQuestion[];
}

interface QuestionBankResponse {
  contentId: string;
  questionBank: QuestionBank;
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

const QuestionBankPage: React.FC = () => {
  const [contentId, setContentId] = useState<string>('');
  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contentId.trim()) {
      setMessage('Please enter a Content ID.');
      return;
    }
    setIsLoading(true);
    setQuestionBank(null);
    setMessage(null);

    try {
      const response = await axios.post<QuestionBankResponse>(`${API_BASE_URL}/content/generate-questions`, {
        contentId: contentId,
      });

      setQuestionBank(response.data.questionBank);
      setMessage(`Question bank for Content ID '${response.data.contentId}' generated successfully.`);
      console.log('Question Bank Response:', response.data);

    } catch (error) {
      console.error('API Error generating question bank:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        setMessage(`Error: ${axiosError.response.data.error} ${axiosError.response.data.details || ''}`);
      } else if (axiosError.request) {
        setMessage('Error: No response received from server.');
      } else {
        setMessage(`Error: ${axiosError.message}`);
      }
      setQuestionBank(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Generate Question Bank</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label htmlFor="content-id" className="block text-sm font-medium text-gray-700">
            Content ID
          </label>
          <input
            type="text"
            name="content-id"
            id="content-id"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter Content ID"
            value={contentId}
            onChange={(e) => setContentId(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={isLoading || !contentId.trim()}
        >
          {isLoading ? 'Generating Questions...' : 'Generate Questions'}
        </button>
      </form>

      {message && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${message.startsWith('Error:') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`} role="alert">
          {message}
        </div>
      )}

      {questionBank && (
        <div className="mt-6 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Multiple Choice Questions</h2>
            {questionBank.mcqs.length > 0 ? (
              <ul className="space-y-4">
                {questionBank.mcqs.map((mcq, index) => (
                  <li key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <p className="font-medium text-gray-800">Q{index + 1}: {mcq.question}</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {mcq.options.map((option, i) => (
                        <li key={i} className={`text-gray-600 ${option === mcq.correctAnswer ? 'font-semibold text-green-600' : ''}`}>
                          {option} {option === mcq.correctAnswer ? '(Correct)' : ''}
                        </li>
                      ))}
                    </ul>
                    {mcq.explanation && <p className="text-sm text-gray-500 mt-1"><em>Explanation: {mcq.explanation}</em></p>}
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No MCQs generated.</p>}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Short Answer Questions</h2>
            {questionBank.shortAnswerQuestions.length > 0 ? (
              <ul className="space-y-4">
                {questionBank.shortAnswerQuestions.map((saq, index) => (
                  <li key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <p className="font-medium text-gray-800">Q{index + 1}: {saq.question}</p>
                    <p className="text-sm text-green-600 mt-1">Ideal Answer: {saq.idealAnswer}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No short answer questions generated.</p>}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Long Answer Questions</h2>
            {questionBank.longAnswerQuestions.length > 0 ? (
              <ul className="space-y-4">
                {questionBank.longAnswerQuestions.map((laq, index) => (
                  <li key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <p className="font-medium text-gray-800">Q{index + 1}: {laq.question}</p>
                    {laq.guidelines && <p className="text-sm text-gray-500 mt-1"><em>Guidelines: {laq.guidelines}</em></p>}
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No long answer questions generated.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankPage;
