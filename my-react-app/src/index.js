import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './css/index.css';
import reportWebVitals from './reportWebVitals.js';
import Layout from "./pages/Layout.js";
import MainPage from "./pages/MainPage.js";
import RentedBooks from "./pages/RentedBooks.js";
import Books from "./pages/BooksList.js";
import LoginPage from "./pages/LoginPage.js";
import NoPage from "./pages/NoPage.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="main" element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="rentedBooks" element={<RentedBooks />} />
          <Route path="books" element={<Books />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);