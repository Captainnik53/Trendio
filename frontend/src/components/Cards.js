// src/components/Cards.js
import React from 'react';
import styles from './Cards.module.css';

const Card = ({ logo, name, price, change, description }) => {
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
  const stockData = [
    { logo: '🔴', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...' },
    { logo: '🔵', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...' },
    { logo: '🔶', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...' },
    { logo: '⚫', name: 'Amazon (AMZN)', price: '$279.9', change: '🔺10%', description: 'Apple Inc is designs, manufactures and markets mobile communication and media devices...' },
  ];

  return (
    <div className={styles.cardsContainer}>
      {stockData.map((stock, index) => (
        <Card key={index} {...stock} />
      ))}
    </div>
  );
};

export default Cards;
