import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Import routes with error handling
let userRoute, companyRoute, jobRoute, applicationRoute, connectDB;

try {
    const routes = await Promise.all([
        import("../routes/user.route.js"),
        import("../routes/company.route.js"),
        import("../routes/job.route.js"),
        import("../routes/application.route.js"),
        import("../utils/db.js")
    ]);
    
    userRoute = routes[0].default;
    companyRoute = routes[1].default;
    jobRoute = routes[2].default;
    applicationRoute = routes[3].default;
    connectDB = routes[4].default;
} catch (error) {
    console.error("Failed to import modules:", error);
}

dotenv.config();

const app = express();

// Test endpoints
app.get("/", (req, res) => {
    res.json({
        message: "Backend is running successfully on Vercel!",
        success: true,
        timestamp: new Date().toISOString()
    });
});

app.get("/api", (req, res) => {
    res.json({
        message: "API is working!",
        success: true,
        hasRoutes: !!(userRoute && companyRoute && jobRoute && applicationRoute),
        hasDB: !!connectDB
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
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            process.env.FRONTEND_URL,
        ];
        
        // In development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
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

// Database connection middleware (only if connectDB is available)
if (connectDB) {
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
}

// API routes (only if routes are available)
if (userRoute) app.use("/api/v1/user", userRoute);
if (companyRoute) app.use("/api/v1/company", companyRoute);
if (jobRoute) app.use("/api/v1/job", jobRoute);
if (applicationRoute) app.use("/api/v1/application", applicationRoute);

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        modules: {
            userRoute: !!userRoute,
            companyRoute: !!companyRoute,
            jobRoute: !!jobRoute,
            applicationRoute: !!applicationRoute,
            connectDB: !!connectDB
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        message: error.message || 'Internal server error',
        success: false,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

// 404 handler - use a proper catch-all route
app.all('*', (req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
        success: false,
        availableRoutes: [
            '/',
            '/api',
            '/health',
            '/api/v1/user/*',
            '/api/v1/company/*',
            '/api/v1/job/*',
            '/api/v1/application/*'
        ]
    });
});

export default app;