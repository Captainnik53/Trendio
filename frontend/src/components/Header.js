// src/components/Header.js
import React from 'react';
import trendioLogo from '../assets/trendio_logo.svg';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={trendioLogo} height={`40px`} width={`40px`} alt="Tredio" />
        <div className={styles.logoName}>Tredio.io</div>
      </div>
      
      <nav className={styles.nav}>
        <a href="/top-stocks">Top Stocks</a>
        <a href="/news">News</a>
        <a href="/our-picks">Our Picks</a>
        <a href="/contacts">Contact</a>
      </nav>
      <div className={styles.auth}>
        <button className={styles.login}>Log in</button>
        <button className={styles.signup}>Sign up</button>
      </div>
    </header>
  );
};

export default Header;
