# AI Educational Assistant Platform

This project is a web-based educational assistant platform designed to help students learn efficiently. It allows users to upload or link various content types (documents, YouTube videos, web pages, images), extracts information, summarizes it, and provides AI-powered assistance like Q&A and question bank generation.

## Project Structure

The project is organized into two main parts within this repository:

*   \`./backend/\`: A Node.js application using Express, TypeScript, and MongoDB. It handles content processing, AI interactions (currently placeholders), and serves the API.
*   \`./frontend/\`: A React application using TypeScript (and intended Tailwind CSS for styling). It provides the user interface for interacting with the platform.

## Overall Architecture

1.  **Frontend (React)**: Users interact with the platform through the web interface. They can upload content, view summaries, generate questions, and use the chat assistant.
2.  **Backend (Node.js/Express)**:
    *   Receives requests from the frontend.
    *   Handles file uploads and external content fetching (YouTube, webpages).
    *   Performs content extraction (text from documents, transcripts, OCR from images).
    *   Interacts with AI services (currently placeholders) for summarization, Q&A, and question generation.
    *   Stores content metadata and processed information in a MongoDB database.
    *   Exposes a RESTful API for the frontend.
3.  **Database (MongoDB)**: Stores metadata about the content, extracted text, summaries, and potentially user data in future versions.

## Prerequisites

*   [Node.js](https://nodejs.org/) (v16.x or later recommended for both backend and frontend)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community) (a running instance, local or remote)

## Setup and Running the Application

You'll need to set up and run both the backend and frontend services. They typically run on different ports.

### 1. Backend Setup

Navigate to the backend directory and follow these steps:

\`\`\`bash
cd backend
\`\`\`

1.  **Install Dependencies:**
    \`\`\`bash
    npm install
    # or
    # yarn install
    \`\`\`

2.  **Configure Environment Variables:**
    Create a \`.env\` file in the \`./backend/\` directory by copying \`backend/.env.example\` (if it exists, or create one manually).
    Key variables:
    *   \`PORT\`: Port for the backend server (e.g., 3001).
    *   \`MONGODB_URI\`: Your MongoDB connection string (e.g., \`mongodb://localhost:27017/educationalAssistant\`).
    *   (Future: \`OPENAI_API_KEY\`, etc.)

    Example \`backend/.env\`:
    \`\`\`env
    PORT=3001
    MONGODB_URI=mongodb://localhost:27017/educationalAssistant
    \`\`\`

3.  **Run the Backend Development Server:**
    \`\`\`bash
    npm run dev
    \`\`\`
    The backend server should now be running (e.g., on \`http://localhost:3001\`).

### 2. Frontend Setup

Navigate to the frontend directory (from the project root) and follow these steps:

\`\`\`bash
cd frontend # Make sure you are in ./ai-educational-platform/frontend
\`\`\`

1.  **Install Dependencies:**
    \`\`\`bash
    npm install
    # or
    # yarn install
    \`\`\`

2.  **Configure Environment Variables (Optional but Recommended):**
    The frontend uses \`REACT_APP_API_BASE_URL\` to connect to the backend. Create a \`.env\` file in the \`./frontend/\` directory.

    Example \`frontend/.env\`:
    \`\`\`env
    REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
    \`\`\`
    If this file is not present, it defaults to \`http://localhost:3001/api/v1\` in the code.

3.  **Run the Frontend Development Server:**
    \`\`\`bash
    npm start # This starts the React development server
    \`\`\`
    The frontend development server will start (usually on \`http://localhost:3000\`) and should open in your browser.

    **Note on Tailwind CSS**: The project is intended to use Tailwind CSS. However, there were issues with its installation in the development environment. The React components have been written with Tailwind classes. If Tailwind is not rendering correctly, ensure its dependencies (\`tailwindcss\`, \`postcss\`, \`autoprefixer\`) are correctly installed and \`frontend/src/index.css\` includes the necessary Tailwind directives.

## Key Backend API Endpoints (Version 1 - /api/v1)

(Served by the backend, typically at \`http://localhost:3001/api/v1\`)

*   **Content Management:**
    *   \`POST /content/upload\`: Upload files (PDF, DOC, DOCX, images). OCR for images.
    *   \`POST /content/link/youtube\`: Submit YouTube video URLs.
    *   \`POST /content/link/webpage\`: Submit web page URLs.
*   **AI Services (Placeholders):**
    *   \`POST /content/summarize\`: Request content summarization.
    *   \`POST /content/answer-question\`: Ask a question based on content.
    *   \`POST /content/generate-questions\`: Generate a question bank.

*(For more details on backend API request/response formats, refer to backend controller code or future API documentation.)*

---

This README provides a consolidated guide for the AI Educational Assistant Platform.
EOL
