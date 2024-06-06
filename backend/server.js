require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const BASE_API_URL = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE'; // Replace with the actual API URL
const API_TOKEN = process.env.API_TOKEN;
const STOCK_SYMBOL = 'IBM'
const API_URL = `${BASE_API_URL}&symbol=${STOCK_SYMBOL}&apikey=${API_TOKEN}`;

// Function to check if the API is working
const checkApiStatus = async () => {
    try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
            console.log('API is working properly');
            console.log(response.data);
        } else {
            console.error(`API check failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error checking API: ${error.message}`);
    }
};

// Check the API status as soon as the server starts
checkApiStatus();

io.on('connection', (socket) => {
    console.log('New client connected');

    const fetchData = async () => {
        try {
            const response = await axios.get(API_URL);
            socket.emit('FromAPI', response.data);
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    };

    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    socket.on('disconnect', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
