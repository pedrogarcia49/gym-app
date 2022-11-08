import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import Home from './components/Home/Home.jsx'
import AdminPanel from './components/AdminPanel/AdminPanel.jsx'
import Checkin from './components/Checkin/Checkin.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
          <Route path="/admin" element={<AdminPanel/>}/>
          <Route path="/checkin" element={<Checkin/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

