import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  sourceType: 'upload' | 'youtube' | 'webpage' | 'image_ocr';
  originalName?: string; // For uploaded files
  url?: string; // For YouTube links or webpages
  filePath?: string; // Path to stored file, if applicable
  mimetype?: string; // For uploaded files
  title?: string; // Extracted title (e.g., from webpage, video)

  extractedText?: string; // Text extracted from source (transcript, OCR, webpage text)
  summary?: string; // AI-generated summary

  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingError?: string;

  // Timestamps are automatically added by Mongoose (createdAt, updatedAt)
}

const ContentSchema: Schema = new Schema({
  sourceType: { type: String, required: true, enum: ['upload', 'youtube', 'webpage', 'image_ocr'] },
  originalName: { type: String },
  url: { type: String },
  filePath: { type: String },
  mimetype: { type: String },
  title: { type: String },

  extractedText: { type: String },
  summary: { type: String },

  status: { type: String, required: true, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  processingError: { type: String },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Indexing common query fields
ContentSchema.index({ sourceType: 1 });
ContentSchema.index({ status: 1 });
ContentSchema.index({ createdAt: -1 });

export default mongoose.model<IContent>('Content', ContentSchema);
