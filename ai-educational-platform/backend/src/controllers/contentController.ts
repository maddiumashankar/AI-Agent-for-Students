import * as cheerio from 'cheerio';
import axios from 'axios';
import ytdl from 'ytdl-core';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Tesseract from 'tesseract.js';
import * as aiService from '../services/aiService';

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Keep original file name: cb(null, file.originalname);
    // Or, create a unique filename:
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    // Basic file type validation (can be expanded)
    const allowedTypes = /pdf|doc|docx|jpeg|jpg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File type not allowed! Allowed types: ' + allowedTypes));
  }
}).single('file'); // 'file' is the name attribute in the form


export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, async (err: any) => { // Added async here
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const file = req.file;
    const isImage = file.mimetype.startsWith('image/');
    let ocrText = null;
    let message = 'File uploaded successfully. Processing started.';

    if (isImage) {
      try {
        console.log(`Performing OCR on image: ${file.path}`);
        const { data: { text } } = await Tesseract.recognize(
          file.path,
          'eng', // Language: English
          { logger: m => console.log(m) } // Optional: Log OCR progress
        );
        ocrText = text;
        message = 'Image uploaded and OCR processing completed.';
        console.log(`OCR Result for ${file.originalname}: ${text.substring(0,100)}...`);
      } catch (ocrError: any) {
        console.error('OCR Error:', ocrError);
        // Don't fail the whole upload for OCR error, just log it and proceed
        message = 'Image uploaded, but OCR processing failed.';
      }
    }

    // Placeholder: Save file metadata and OCR text (if any) to DB
    // This part will be expanded when DB is integrated.

    res.status(201).json({
      id: file.filename, // Using filename as a temporary ID
      type: file.mimetype,
      fileName: file.originalname,
      message: message,
      ocrText: ocrText, // Include OCR text in the response if available
      // statusUrl: `/api/v1/content/status/${file.filename}`
    });
  });
};


export const handleYoutubeLink = async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid or missing YouTube URL.' });
    }

    try {
        const videoInfo = await ytdl.getInfo(url);
        const videoId = videoInfo.videoDetails.videoId;
        const title = videoInfo.videoDetails.title;
        // Further processing like transcript extraction would go here.
        // For now, we'll just return basic info.

        // Placeholder: Save metadata to DB (to be implemented later)
        const contentId = `youtube_${videoId}`; // Temporary ID

        res.status(202).json({
            id: contentId,
            type: 'youtube',
            url: url,
            title: title,
            message: 'YouTube video link received. Processing started.',
            // statusUrl: `/api/v1/content/status/${contentId}`
        });
    } catch (error: any) {
        console.error('Error processing YouTube URL:', error);
        // console.error('Error processing YouTube URL:', error); // Already logged by the original code
        // res.status(500).json({ error: 'Failed to process YouTube URL.', details: error.message });
        next(error); // Forward error to Express error handler
    }
};

export const handleWebpageLink = async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL.' });
    }

    try {
        // Validate URL format (basic check)
        new URL(url); // This will throw an error if the URL is invalid
    } catch (error) {
        return res.status(400).json({ error: 'Invalid URL format.' });
    }

    try {
        const response = await axios.get(url, { timeout: 10000 });
        const html = response.data;
        const $ = cheerio.load(html);

        // Basic content extraction (can be improved significantly)
        let extractedText = '';
        $('h1, h2, h3, h4, h5, h6, p, article, .main-content, .entry-content').each((i, elem) => {
            extractedText += $(elem).text().trim() + '\n\n';
        });

        if (!extractedText.trim()) {
            // Fallback: try to get all text from body if specific selectors yield nothing
            extractedText = $('body').text().trim().replace(/\s\s+/g, ' '); // Replace multiple spaces/newlines with a single space
        }

        const title = $('title').text() || 'Untitled Webpage';

        // Placeholder: Save metadata and extracted text to DB
        const contentId = `webpage_${Date.now()}`; // Temporary ID

        res.status(202).json({
            id: contentId,
            type: 'webpage',
            url: url,
            title: title,
            // extractedText: extractedText.substring(0, 500), // Send a snippet for preview
            message: 'Web page URL received. Content extraction started.',
            // statusUrl: `/api/v1/content/status/${contentId}`
        });
    } catch (error: any) {
        console.error('Error processing web page URL:', error);
        if (axios.isAxiosError(error)) {
            return next(new Error(`Failed to fetch web page: ${error.message}`));
        }
        return next(new Error(`Failed to process web page URL: ${error.message}`));
    }
};

// Placeholder for status handler
export const getContentStatus = (req: Request, res: Response) => {
    res.status(501).json({ message: 'Content status not yet implemented.' });
};


// AI Service Placeholder Controllers
export const summarizeContentController = async (req: Request, res: Response, next: NextFunction) => {
  const { contentId, text } = req.body; // Expecting text or a way to retrieve it via contentId
  if (!text && !contentId) {
    return res.status(400).json({ error: 'Missing contentId or text to summarize.' });
  }
  // In a real app, you'd fetch text using contentId if only ID is provided
  const effectiveText = text || `Text for content ID \${contentId} (fetched from DB - placeholder)`;
  try {
    const summary = await aiService.summarizeContent(effectiveText, contentId);
    res.json({ contentId, summary });
  } catch (error) {
    next(error);
  }
};

export const answerQuestionController = async (req: Request, res: Response, next: NextFunction) => {
  const { contentId, question, context } = req.body;
  if (!question || (!context && !contentId)) {
    return res.status(400).json({ error: 'Missing question, and context or contentId.' });
  }
  const effectiveContext = context || `Context for content ID \${contentId} (fetched from DB - placeholder)`;
  try {
    const answer = await aiService.answerQuestion(question, effectiveContext, contentId);
    res.json({ contentId, question, answer });
  } catch (error) {
    next(error);
  }
};

export const generateQuestionBankController = async (req: Request, res: Response, next: NextFunction) => {
  const { contentId, text } = req.body;
  if (!text && !contentId) {
    return res.status(400).json({ error: 'Missing contentId or text to generate questions from.' });
  }
  const effectiveText = text || `Text for content ID \${contentId} (fetched from DB - placeholder)`;
  try {
    const questionBank = await aiService.generateQuestionBank(effectiveText, contentId);
    res.json({ contentId, questionBank });
  } catch (error) {
    next(error);
  }
};
