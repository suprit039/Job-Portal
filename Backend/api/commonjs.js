const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

// Test routes
app.get('/', (req, res) => {
    res.json({
        message: "CommonJS Backend is working!",
        success: true,
        timestamp: new Date().toISOString(),
        nodeVersion: process.version
    });
});

app.get('/api', (req, res) => {
    res.json({
        message: "CommonJS API endpoint is working!",
        success: true,
        method: req.method,
        url: req.url
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        message: "Test endpoint working!",
        success: true,
        environment: {
            nodeEnv: process.env.NODE_ENV || 'development',
            platform: process.platform,
            arch: process.arch
        }
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: error.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
        success: false
    });
});

module.exports = app;