import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios'; // Import AxiosError for better error handling

// Define Backend API base URL - In a real app, this would come from an environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';

interface ApiResponse {
  id?: string;
  message: string;
  fileName?: string;
  type?: string;
  title?: string;
  ocrText?: string;
  // Add any other fields you expect from your backend responses
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

const UploadLinkPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [webpageUrl, setWebpageUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'file' | 'youtube' | 'webpage'>('file');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null); // For success/error messages

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setYoutubeUrl('');
      setWebpageUrl('');
      setMessage(null);
    }
  };

  const handleUrlInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setSelectedFile(null);
    setMessage(null);
    // Clear other URL input based on which one is being typed into
    if (setter === setYoutubeUrl) setWebpageUrl('');
    if (setter === setWebpageUrl) setYoutubeUrl('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      let response;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        response = await axios.post<ApiResponse>(`${API_BASE_URL}/content/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage(`File '${response.data.fileName}' uploaded successfully! ID: ${response.data.id}, OCR: ${response.data.ocrText ? response.data.ocrText.substring(0,50)+'...' : 'N/A'}`);
      } else if (youtubeUrl) {
        response = await axios.post<ApiResponse>(`${API_BASE_URL}/content/link/youtube`, { url: youtubeUrl });
        setMessage(`YouTube URL '${response.data.title}' processed! ID: ${response.data.id}`);
      } else if (webpageUrl) {
        response = await axios.post<ApiResponse>(`${API_BASE_URL}/content/link/webpage`, { url: webpageUrl });
        setMessage(`Webpage '${response.data.title}' processed! ID: ${response.data.id}`);
      } else {
        setMessage('No input provided.');
        setIsLoading(false);
        return;
      }
      console.log('API Response:', response.data);
      // Optionally reset form after successful submission
      // setSelectedFile(null); setYoutubeUrl(''); setWebpageUrl(''); setActiveTab('file');
    } catch (error) {
      console.error('API Error:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        setMessage(`Error: ${axiosError.response.data.error} ${axiosError.response.data.details || ''}`);
      } else if (axiosError.request) {
        setMessage('Error: No response received from server. Check if the backend is running.');
      } else {
        setMessage(`Error: ${axiosError.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Note: The render functions are now part of the return statement directly as per the prompt's final version
  // No separate renderFileInput, renderYoutubeInput, renderWebpageInput functions are defined at this scope in the final prompt.
  // They are implicitly defined within the JSX returned by the main component.

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Upload Content or Add Links</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {/* Tab buttons remain the same, but onClick handlers clear message */}
          <button onClick={() => { setActiveTab('file'); setMessage(null); }}
            className={`${activeTab === 'file' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                         whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}>
            Upload File
          </button>
          <button onClick={() => { setActiveTab('youtube'); setMessage(null); }}
            className={`${activeTab === 'youtube' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                         whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}>
            YouTube Link
          </button>
          <button onClick={() => { setActiveTab('webpage'); setMessage(null); }}
            className={`${activeTab === 'webpage' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                         whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}>
            Web Page Link
          </button>
        </nav>
      </div>

      {message && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${message.startsWith('Error:') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'file' && (
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
              Upload a file (PDF, DOC, DOCX, Image)
            </label>
            <input id="file-upload" name="file-upload" type="file"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
            {selectedFile && <p className="mt-2 text-sm text-gray-600">Selected file: {selectedFile.name}</p>}
          </div>
        )}
        {activeTab === 'youtube' && (
          <div>
            <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700">YouTube Video URL</label>
            <div className="mt-1">
              <input type="url" name="youtube-url" id="youtube-url"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl}
                onChange={(e) => handleUrlInputChange(setYoutubeUrl, e.target.value)} />
            </div>
          </div>
        )}
        {activeTab === 'webpage' && (
          <div>
            <label htmlFor="webpage-url" className="block text-sm font-medium text-gray-700">Web Page URL</label>
            <div className="mt-1">
              <input type="url" name="webpage-url" id="webpage-url"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://example.com/article" value={webpageUrl}
                onChange={(e) => handleUrlInputChange(setWebpageUrl, e.target.value)} />
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            disabled={isLoading || (!selectedFile && !youtubeUrl && !webpageUrl)}
          >
            {isLoading ? 'Processing...' : 'Process Content'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadLinkPage;
