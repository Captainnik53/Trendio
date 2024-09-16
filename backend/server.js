require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cheerio = require('cheerio');
const axios = require('axios');
const url = require('url');

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

        const targetDivText  = $('div.YMlKec.fxKbKc').first().text()
        const companyName = $('div.zzDege').first().text()
        const description = $('div.bLLb2d').first().text().trim();  // Trim any leading/trailing whitespace

        // Find the index of the first occurrence of ". " followed by a capital letter
        const match = description.match(/\.\s+[A-Z]/);

        let firstLine;
        if (match) {
            const periodIndex = match.index;
            firstLine = description.substring(0, periodIndex + 1).trim();  // Extract text up to and including the period
        } else {
            firstLine = description;  // If no match is found, take the whole text
        }

        let companyLink = null;

        $('a.tBHE4e').each(function() {
        const href = $(this).attr('href');
        if (href && !href.includes('wikipedia') && !href.includes('maps') && !href.includes('search')) {
            companyLink = href;
            return false; // Exit the loop once the first matching element is found
        }
        });
        console.log("this is company link" + companyLink)
        console.log(targetDivText);
        const parsedUrl = url.parse(companyLink);
        const hostname = parsedUrl.hostname;

        // Remove the 'www.' prefix if it exists
        const domainLink = hostname.replace(/^www\./, '');
        return {price: targetDivText, domain: domainLink, companyName: companyName, companyDescription: firstLine};
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
