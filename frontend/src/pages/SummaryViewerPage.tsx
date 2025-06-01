import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';

interface SummaryResponse {
  contentId: string;
  summary: string;
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

const SummaryViewerPage: React.FC = () => {
  const [contentId, setContentId] = useState<string>('');
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contentId.trim()) {
      setMessage('Please enter a Content ID.');
      return;
    }
    setIsLoading(true);
    setSummary(null);
    setMessage(null);

    try {
      const response = await axios.post<SummaryResponse>(`${API_BASE_URL}/content/summarize`, {
        contentId: contentId,
      });

      setSummary(response.data.summary);
      setMessage(`Summary for Content ID '${response.data.contentId}' fetched successfully.`);
      console.log('Summary Response:', response.data);

    } catch (error) {
      console.error('API Error fetching summary:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        setMessage(`Error: ${axiosError.response.data.error} ${axiosError.response.data.details || ''}`);
      } else if (axiosError.request) {
        setMessage('Error: No response received from server.');
      } else {
        setMessage(`Error: ${axiosError.message}`);
      }
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    // Placeholder functionality
    console.log(`Placeholder: Download PDF for content ID: ${contentId}`);
    alert('PDF download functionality will be implemented in a future update! The summary content is available below for now.');
    // In the future, this would trigger an API call to a backend endpoint
    // e.g., window.open(`${API_BASE_URL}/content/${contentId}/download-pdf`, '_blank');
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">View Content Summary</h1>

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
            placeholder="Enter Content ID (e.g., from upload response)"
            value={contentId}
            onChange={(e) => setContentId(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={isLoading || !contentId.trim()}
        >
          {isLoading ? 'Fetching Summary...' : 'Get Summary'}
        </button>
      </form>

      {message && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${message.startsWith('Error:') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`} role="alert">
          {message}
        </div>
      )}

      {summary && (
        <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-700">Summary:</h2>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
              disabled={!contentId} // Disable if no contentId to associate PDF with
            >
              Download PDF
            </button>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryViewerPage;
