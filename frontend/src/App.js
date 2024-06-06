// src/App.js
import React from 'react';
import Header from './components/Header';
import Search from './components/Search';
import Cards from './components/Cards';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Search />
      <Cards />
    </div>
  );
}

export default App;
