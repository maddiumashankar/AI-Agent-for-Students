import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'; // Added body-parser
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandlingMiddleware, notFoundHandler } from './middlewares/errorHandlingMiddleware';
import contentRoutes from './routes/contentRoutes'; // Added contentRoutes import

dotenv.config();

const app: Express = express();
app.use(bodyParser.json()); // Added body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // Added body-parser middleware
const port = process.env.PORT || 3000;

app.use('/api/v1/content', contentRoutes); // Added content routes

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running!');
});


// Connect to MongoDB
connectDB();


// Handle 404 errors for routes not found
app.use(notFoundHandler);

// Global error handling middleware (should be the last middleware)
app.use(errorHandlingMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
