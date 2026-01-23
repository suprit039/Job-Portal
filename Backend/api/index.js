import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import applicationRoute from "../routes/application.route.js";
import companyRoute from "../routes/company.route.js";
import jobRoute from "../routes/job.route.js";
import userRoute from "../routes/user.route.js";
import connectDB from "../utils/db.js";

dotenv.config({});

const app = express();

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Backend is running successfully on Vercel!",
        success: true
    });
});

app.get("/api", (req, res) => {
    return res.status(200).json({
        message: "API is working!",
        success: true
    });
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        // In production, allow your frontend domain
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            process.env.FRONTEND_URL, // Add your frontend Vercel URL here
        ];
        
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));

// Connect to database before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ 
            message: 'Database connection failed', 
            success: false 
        });
    }
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        message: error.message || 'Internal server error',
        success: false
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
        success: false
    });
});

export default app;
