// src/App.js
import React from 'react';
import './App.css';
import Map from './components/Map';

function App() {
  return (
    <div className="App">
      <h1>Map App</h1>
      <Map apiKey="AIzaSyBvoeJAcArrXzzZEJAKl0n9Qwp8RccK6oM" />
    </div>
  );
}

export default App;
