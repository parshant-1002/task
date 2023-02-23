import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Countries from './component/countries';
import Cities from './component/cities';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Countries />} />
        <Route path="/:countrydata" element={<Cities />} />

      </Routes>
    </div>
  );
}

export default App;
