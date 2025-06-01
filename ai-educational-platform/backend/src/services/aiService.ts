// src/services/aiService.ts

/**
 * Placeholder for content summarization.
 * @param text The text to summarize.
 * @param contentId Optional ID of the content being summarized.
 * @returns A promise that resolves to a summary string.
 */
export const summarizeContent = async (text: string, contentId?: string): Promise<string> => {
  console.log(`[AIService] Summarizing content (id: ${contentId || 'N/A'}). Length: ${text.length}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `This is a placeholder summary for content starting with: "${text.substring(0, 100)}..."`;
};

/**
 * Placeholder for answering questions based on content.
 * @param question The question asked by the student.
 * @param context The content context for answering the question.
 * @param contentId Optional ID of the content.
 * @returns A promise that resolves to an answer string.
 */
export const answerQuestion = async (question: string, context: string, contentId?: string): Promise<string> => {
  console.log(`[AIService] Answering question: "${question}" (id: ${contentId || 'N/A'})`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return `This is a placeholder answer to: "${question}". The context provided starts with: "${context.substring(0, 100)}..."`;
};

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string; // Could be an index or the string itself
  explanation?: string;
}

export interface ShortAnswerQuestion {
  question: string;
  idealAnswer: string;
  keywords?: string[];
}

export interface LongAnswerQuestion {
  question: string;
  guidelines?: string; // Points to cover, structure, etc.
}

export interface QuestionBank {
  mcqs: MCQ[];
  shortAnswerQuestions: ShortAnswerQuestion[];
  longAnswerQuestions: LongAnswerQuestion[];
}

/**
 * Placeholder for generating a question bank from text.
 * @param text The text to generate questions from.
 * @param contentId Optional ID of the content.
 * @returns A promise that resolves to a QuestionBank object.
 */
export const generateQuestionBank = async (text: string, contentId?: string): Promise<QuestionBank> => {
  console.log(`[AIService] Generating question bank for content (id: ${contentId || 'N/A'}). Length: ${text.length}`);
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    mcqs: [
      {
        question: "What is the capital of Placeholderland?",
        options: ["Option A", "Option B", "Placeholder City", "Option D"],
        correctAnswer: "Placeholder City",
        explanation: "Placeholder City is famously the capital."
      },
      {
        question: "Which of these is a placeholder concept?",
        options: ["Alpha", "Beta", "Gamma", "Placeholder"],
        correctAnswer: "Placeholder",
      }
    ],
    shortAnswerQuestions: [
      {
        question: "Define 'placeholder'.",
        idealAnswer: "A placeholder is something used temporarily until the real thing is available."
      }
    ],
    longAnswerQuestions: [
      {
        question: "Discuss the importance of placeholders in software development.",
        guidelines: "Cover aspects like iterative development, API mocking, and UI previews."
      }
    ]
  };
};

console.log('[AIService] Placeholder AI Service loaded.');
