// Simple test script to verify API endpoints
import fetch from 'node-fetch';

const API_BASE = 'https://your-backend-domain.vercel.app'; // Replace with your actual backend URL

async function testAPI() {
    try {
        console.log('Testing backend API...');
        
        // Test root endpoint
        const response = await fetch(`${API_BASE}/`);
        const data = await response.json();
        console.log('Root endpoint:', data);
        
        // Test API endpoint
        const apiResponse = await fetch(`${API_BASE}/api`);
        const apiData = await apiResponse.json();
        console.log('API endpoint:', apiData);
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Uncomment to run test
// testAPI();