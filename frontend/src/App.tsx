import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import UploadLinkPage from './pages/UploadLinkPage';
import SummaryViewerPage from './pages/SummaryViewerPage';
import QuestionBankPage from './pages/QuestionBankPage';
import ChatAssistantPage from './pages/ChatAssistantPage';
// Ensure src/index.css is imported if it's not already (CRA usually does this)
// For Tailwind, it's crucial that index.css (with @tailwind directives) is imported here or in index.tsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="upload" element={<UploadLinkPage />} />
          <Route path="summary" element={<SummaryViewerPage />} />
          <Route path="questions" element={<QuestionBankPage />} />
          <Route path="chat" element={<ChatAssistantPage />} />
          {/* You can add a 404 page here later */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
