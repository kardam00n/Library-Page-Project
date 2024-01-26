import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './css/index.css';
import reportWebVitals from './reportWebVitals';
import Layout from "./pages/Layout";
import MainPage from "./pages/MainPage";
// import HelloWorld from "./pages/HelloWorld";
// import BooksList from "./pages/BookList";
import LoginPage from "./pages/LoginPage";
// import NoPage from "./pages/NoPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="main" element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          {/* <Route path="books" element={<BooksList />} /> */}
          {/* <Route path="HelloWorld" element={<HelloWorld />} />
          

          <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);