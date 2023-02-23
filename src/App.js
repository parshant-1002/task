
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Countries from './component/Countries';
import Cities from './component/Cities';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Countries />} />
        <Route path="/:country" element={<Cities />} />

      </Routes>
    </div>
  );
}

export default App;
