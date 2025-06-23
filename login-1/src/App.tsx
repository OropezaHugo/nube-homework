import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './pages/login';
import Register from './pages/register';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/home';
import { AuthProvider } from './AuthContext';
import { ToastContainer } from 'react-toastify';

function App() {
  
  return (
    <AuthProvider>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/home" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  
  );
}

export default App;
