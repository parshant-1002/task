// libs
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// components
import Countries from './component/Countries';
import Cities from './component/Cities';

// styles
import './App.css';

function App() {
  return (
    <div >
      <Routes>
        <Route exact path="/" element={<Countries />} />
        <Route path="/:country" element={<Cities />} />
      </Routes>
    </div>
  );
}

export default App;
