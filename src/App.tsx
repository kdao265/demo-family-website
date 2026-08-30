import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Story from './pages/Story';
import Gallery from './pages/Gallery';
import Guestbook from './pages/Guestbook';
import FamilyTree from './pages/FamilyTree';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGuard from './components/admin/AdminGuard';
import Families from './pages/admin/Families';
import Members from './pages/admin/Members';
import Relationships from './pages/admin/Relationships';
import Moments from './pages/admin/Moments';
import GuestbookAdmin from './pages/admin/Guestbook';

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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              }
            />

            <Route
              path="/admin/families"
              element={
                <AdminGuard>
                  <Families />
                </AdminGuard>
              }
            />
            
            <Route
              path="/admin/members"
              element={
                <AdminGuard>
                  <Members />
                </AdminGuard>
              }
            />
            
            <Route
              path="/admin/relationships"
              element={
                <AdminGuard>
                  <Relationships />
                </AdminGuard>
              }
            />

            <Route
              path="/admin/moments"
              element={
                <AdminGuard>
                  <Moments />
                </AdminGuard>
              }
            />

            <Route
              path="/admin/guestbook"
              element={
                <AdminGuard>
                  <GuestbookAdmin />
                </AdminGuard>
              }
            />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
