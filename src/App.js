import React from 'react';
import firebase from './Firebase';
import './App.css';
import SearchAndPassData from './SearchAndPassData';

function App() {

  return (
      <div className="App">
        <div>
          <SearchAndPassData />
        </div>
      </div>
  );
}

export default App;
