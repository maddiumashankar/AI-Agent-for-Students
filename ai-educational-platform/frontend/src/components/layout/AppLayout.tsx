import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <nav className="container mx-auto flex justify-between">
          <Link to="/" className="text-xl font-bold hover:text-gray-300">EduAssistant</Link>
          <div>
            <Link to="/" className="mr-4 hover:text-gray-300">Dashboard</Link>
            <Link to="/upload" className="mr-4 hover:text-gray-300">Upload/Link</Link>
            <Link to="/summary" className="mr-4 hover:text-gray-300">Summary</Link>
            <Link to="/questions" className="mr-4 hover:text-gray-300">Question Bank</Link>
            <Link to="/chat" className="hover:text-gray-300">Chat Assistant</Link>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-6">
        <Outlet /> {/* This is where nested routes will render their components */}
      </main>
      <footer className="bg-gray-700 text-white p-4 text-center">
        © 2023 EduAssistant Platform
      </footer>
    </div>
  );
};

export default AppLayout;
