import { Router, RequestHandler } from 'express'; // Import RequestHandler
import {uploadFile, handleYoutubeLink, handleWebpageLink, getContentStatus, summarizeContentController, answerQuestionController, generateQuestionBankController} from '../controllers/contentController';

const router = Router();

// POST /api/v1/content/upload
router.post('/upload', uploadFile);

// POST /api/v1/content/link/youtube
router.post('/link/youtube', handleYoutubeLink as RequestHandler); // Explicitly cast

// POST /api/v1/content/link/webpage
router.post('/link/webpage', handleWebpageLink as RequestHandler); // Explicitly cast

// GET /api/v1/content/status/:contentId
router.get('/status/:contentId', getContentStatus);



// AI Service Placeholder Routes
// POST /api/v1/content/summarize
router.post('/summarize', summarizeContentController as RequestHandler);

// POST /api/v1/content/answer-question
router.post('/answer-question', answerQuestionController as RequestHandler);

// POST /api/v1/content/generate-questions
router.post('/generate-questions', generateQuestionBankController as RequestHandler);

export default router;
