// src/components/Cards.js
import styles from './Cards.module.css';
import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';


const SOCKET_SERVER_URL = 'http://localhost:4000';


let predefinedStockSymbols = []; 

const Card = ({ logo, name, price, change, description, symbol }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardLogo}>{logo}</div>
      <div className={styles.cardContent}>
        <h2>{name}</h2>
        <p className={styles.price}>{price} <span className={styles.change}>{change}</span></p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

const Cards = () => {
  const socket = io(SOCKET_SERVER_URL);
  predefinedStockSymbols = ['AAPL', 'GOOGL', 'NVDA', 'MSFT'];
  // const stockData = [
  //   { logo: '🔴', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...' },
  //   { logo: '🔵', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...' },
  //   { logo: '🔶', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...' },
  //   { logo: '⚫', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...' },
  // ];

  const [stockData, setStockData] = useState(
    {
      'AAPL': { logo: '🔴', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...', symbol: 'AAPL' },
      'GOOGL': { logo: '🔵', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...', symbol: 'GOOGL' },
      'NVDA': { logo: '🔶', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...', symbol: 'NVDA' },
      'MSFT': { logo: '⚫', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...', symbol: 'MSFT' }
    });
  

  useEffect(() => {
    // Connect to the socket server and start tracking predefined stocks
    
    socket.timeout(10000).emit('startTracking', predefinedStockSymbols, (err, responses) => {
      if(err) {
        console.log('error occurred', err);
      }
      else {
        console.log('responses', responses);
      }
      
    });
   
    

    // Listen for real-time data updates from the server
    socket.on('FromAPI', (data) => {
      console.log('Data recieved from API: ', data);
      setStockData((prevData) => {
        const updatedData = {...prevData };
        updatedData[data.symbol].price = data.data
        return updatedData
    });
      console.log('stockData', stockData);
    });

    function onConnect() {
      console.log('Connected to socket server');
    }

    socket.on('connect', onConnect);

    // Clean up the socket connection on component unmount
    return () => {
      socket.emit('stopTracking', predefinedStockSymbols);
      if(socket.connected)
      socket.disconnect();
    };
  }, []);
  
  return (
    <div className={styles.cardsContainer}>
      {predefinedStockSymbols.map((symbol) => (
        <Card key={symbol} {...stockData[symbol]} />
      ))}
    </div>
  );
};

export default Cards;
