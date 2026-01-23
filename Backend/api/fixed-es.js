import cors from 'cors';
import express from 'express';

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

// Simple test route
app.all('*', (req, res) => {
    const response = {
        message: "Fixed ES Module API is working!",
        success: true,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        headers: req.headers,
        body: req.body
    };
    
    res.status(200).json(response);
});

// Export as default for Vercel
export default app;