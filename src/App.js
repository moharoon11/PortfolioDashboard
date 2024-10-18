import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import Index from './Pages/Index';
import Dashboard from './Pages/Dashboard';

import {BrowserRouter, Routes, Route, Router} from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Index />}/>
            <Route path="/dashboard" element={<Dashboard />} />
         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
