// Minimal API to test basic functionality
export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Simple response
    res.status(200).json({
        message: "Minimal API is working!",
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        success: true
    });
}