import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import applicationRoute from "../routes/application.route.js";
import companyRoute from "../routes/company.route.js";
import jobRoute from "../routes/job.route.js";
import userRoute from "../routes/user.route.js";
import connectDB from "../utils/db.js";

// Configure dotenv
dotenv.config({ 
    path: './.env',
    debug: false
});

const app = express();

// Test endpoints
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Backend is running successfully on Vercel!",
        success: true,
        timestamp: new Date().toISOString(),
        env: {
            nodeEnv: process.env.NODE_ENV,
            hasMongoUri: !!process.env.MONGO_URI,
            hasSecretKey: !!process.env.SECRET_KEY
        }
    });
});

app.get("/api", (req, res) => {
    return res.status(200).json({
        message: "API is working!",
        success: true,
        env: process.env.NODE_ENV || 'development'
    });
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            process.env.FRONTEND_URL,
        ];
        
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(null, true); // Temporarily allow all for debugging
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));

// Database connection middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ 
            message: 'Database connection failed', 
            success: false,
            error: error.message
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
    console.error('Unhandled error:', error);
    res.status(500).json({
        message: error.message || 'Internal server error',
        success: false
    });
});

// 404 handler - avoid using wildcards that cause path-to-regexp issues
app.use((req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
        success: false,
        method: req.method,
        availableRoutes: [
            'GET /',
            'GET /api',
            'POST /api/v1/user/register',
            'POST /api/v1/user/login',
            'GET /api/v1/user/logout',
            'POST /api/v1/user/profile/update'
        ]
    });
});

export default app;