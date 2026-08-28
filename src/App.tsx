import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Story from './pages/Story';
import Gallery from './pages/Gallery';
import Guestbook from './pages/Guestbook';
import FamilyTree from './pages/FamilyTree';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/family-tree" element={<FamilyTree />} />
            <Route path="/story" element={<Story />} />
            <Route path="/moments" element={<Gallery />} />
            <Route path="/guestbook" element={<Guestbook />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
