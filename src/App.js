import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShortenerPage from './pages/ShortenerPage';
import StatsPage from './pages/StatsPage';
import RedirectHandler from './components/RedirectHandler';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ShortenerPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/:shortcode" element={<RedirectHandler />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
