// src/components/Search.js
import React from 'react';
import styles from './Search.module.css';
import searchIcon from '../assets/search_icon.svg';

const Search = () => {
  return (
    <div className={styles.searchContainer}>
      <h1>Make Better Investment Decisions With Alternative Data</h1>
      <p>Get the inside scoop on companies like never before. Complement your due diligence with AltIndex.</p>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Search Stocks & Crypto" />
        <span className={`material-symbols-outlined` + ' ' + styles.searchIcon}>search</span>
        <button>Search</button>
      </div>
    </div>
  );
};

export default Search;
