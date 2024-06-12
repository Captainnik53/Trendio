require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // Allow requests from this origin
      methods: ["GET", "POST"],
      credentials: true
    }
  });

const BASE_API_URL = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE'; // Replace with the actual API URL
const API_TOKEN = process.env.API_TOKEN;

const exchange = 'NASDAQ';
// const API_URL = `${BASE_API_URL}&symbol=${STOCK_SYMBOL}&apikey=${API_TOKEN}`;

// // Function to check if the API is working
const checkApiStatus = async () => {
    try {
        const GOOGLE_FIN_API = `https://www.google.com/finance/quote/AMBUJACEM:NSE`;
        const response = await axios.get(GOOGLE_FIN_API);
        const html = response.data;
        const $ = cheerio.load(html);

        const targetDivText  = $('div.YMlKec.fxKbKc').text()
        console.log(targetDivText);
        console.log('finished');
    } catch (error) {
        console.error(`Error checking API: ${error.message}`);
    }
};

// // Check the API status as soon as the server starts
// checkApiStatus();

const fetchStockData = async (stockSymbol) => {
    const GOOGLE_FIN_API = `https://www.google.com/finance/quote/${stockSymbol}:${exchange}`;
    try {
        console.log(GOOGLE_FIN_API);
        const response = await axios.get(GOOGLE_FIN_API);
        const html = response.data;
        // console.log(html);
        const $ = cheerio.load(html);

        const targetDivText  = $('div.YMlKec.fxKbKc').text()
        console.log(targetDivText);
        return targetDivText;
        // socket.emit('FromAPI', targetDivText);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

io.on('connection', (socket) => {
    console.log('New client connected');

    
    const intervals = {};

    socket.on('startTracking', (stockSymbols) => {
        console.log('startTracking', stockSymbols);
        stockSymbols.forEach((symbol) => {
            if (!intervals[symbol]) {
                intervals[symbol] = setInterval(async () => {
                    const data = await fetchStockData(symbol);
                    if (data) {
                        console.log('backend data', data);
                        socket.emit('FromAPI', { symbol, data });
                    }
                }, 5000); // Fetch data every 5 seconds
            }
        });
    });

    socket.on('stopTracking', (stockSymbols) => {
        stockSymbols.forEach((symbol) => {
            clearInterval(intervals[symbol]);
            delete intervals[symbol];
        });
    });

    socket.on('disconnect', () => {
        Object.keys(intervals).forEach((symbol) => {
            clearInterval(intervals[symbol]);
        });
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
