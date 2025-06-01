# Educational Assistant Platform - Backend

This is the backend for the Educational Assistant Platform, a web application designed to help students learn efficiently by processing various content types and providing AI-powered assistance.

## Features Implemented (Backend - Phase 1)

*   **Content Ingestion:**
    *   File uploads (PDF, DOC, DOCX, common image formats) with OCR for images.
    *   YouTube video link processing (metadata extraction).
    *   Web page URL processing (content extraction).
*   **AI Service Placeholders:**
    *   Endpoints for content summarization, question answering, and question bank generation (currently returning mock data).
*   **Database:**
    *   MongoDB integration using Mongoose for storing content metadata.
*   **API:**
    *   RESTful API for all content operations.
*   **Error Handling:**
    *   Global error handling and 404 middleware.

## Prerequisites

*   [Node.js](https://nodejs.org/) (v16.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community) (running instance, local or remote)

## Getting Started

### 1. Clone the Repository

\`\`\`bash
# If you haven't cloned it yet
# git clone <repository_url>
# cd educational-assistant-platform
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
# yarn install
\`\`\`

### 3. Configure Environment Variables

Create a \`.env\` file in the root of the backend project (`educational-assistant-platform/`) and add the following variables. You can copy \`.env.example\` if one exists (we'll create one now).

\`\`\`env
# .env
PORT=3001 # Or any port you prefer for the backend
MONGODB_URI=mongodb://localhost:27017/educationalAssistant # Your MongoDB connection string
# OPENAI_API_KEY=your_openai_api_key_here # (Future use)
\`\`\`

### 4. Running the Development Server

\`\`\`bash
npm run dev
\`\`\`

This command uses \`nodemon\` to start the server, which will automatically restart on file changes. The server will typically be available at \`http://localhost:PORT\` (e.g., \`http://localhost:3001\`).

### 5. Building for Production

\`\`\`bash
npm run build
\`\`\`
This compiles the TypeScript code to JavaScript in the \`dist/\` directory.

### 6. Starting the Production Server

\`\`\`bash
npm start
\`\`\`
This runs the compiled code from the \`dist/\` directory.

## API Endpoints (Version 1 - /api/v1)

*   **Content Management:**
    *   \`POST /api/v1/content/upload\`: Upload a file (form-data with key 'file'). Handles PDF, DOC, DOCX, images (PNG, JPG/JPEG). Performs OCR on images.
    *   \`POST /api/v1/content/link/youtube\`: Submit a YouTube video URL (JSON body: \`{ "url": "video_url" }\`).
    *   \`POST /api/v1/content/link/webpage\`: Submit a web page URL (JSON body: \`{ "url": "page_url" }\`).
    *   \`GET /api/v1/content/status/:contentId\`: (Placeholder) Get processing status of content.

*   **AI Services (Placeholders):**
    *   \`POST /api/v1/content/summarize\`: Request content summarization (JSON body: \`{ "text": "content_to_summarize" }\` or \`{ "contentId": "id_of_content" }\`).
    *   \`POST /api/v1/content/answer-question\`: Ask a question based on content (JSON body: \`{ "question": "your_question", "context": "content_context" }\` or \`{ "contentId": "id_of_content" }\`).
    *   \`POST /api/v1/content/generate-questions\`: Generate a question bank from content (JSON body: \`{ "text": "content_for_questions" }\` or \`{ "contentId": "id_of_content" }\`).

## Project Structure

\`\`\`
educational-assistant-platform/
├── src/
│   ├── controllers/  # Request handlers
│   ├── routes/       # API route definitions
│   ├── services/     # Business logic (AI, etc.)
│   ├── models/       # Mongoose schemas/models
│   ├── config/       # Configuration (database, etc.)
│   ├── middlewares/  # Custom Express middleware
│   ├── utils/        # Utility functions
│   └── index.ts      # Main server application file
├── uploads/          # Directory for temporary file uploads
├── .env.example      # Example environment file
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

## Next Steps (Overall Project)

*   Frontend development using React, TypeScript, and Tailwind CSS.
*   Full implementation of AI service integrations (OpenAI/GPT, etc.).
*   PDF generation for study notes.
*   User authentication and session management (optional).

EOL
