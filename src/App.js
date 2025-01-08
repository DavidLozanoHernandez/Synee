import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Product from './pages/product';
import Index from './pages';
import User from './pages/user';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/product" element={<Product/>} />
        <Route path="/user" element={<User/>} />
      </Routes>
    </Router>
  );
}

export default App;