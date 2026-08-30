import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Story from './pages/Story';
import Gallery from './pages/Gallery';
import Guestbook from './pages/Guestbook';
import FamilyTree from './pages/FamilyTree';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Families from './pages/admin/Families';
import Members from './pages/admin/Members';
import Relationships from './pages/admin/Relationships';
import Moments from './pages/admin/Moments';
import GuestbookAdmin from './pages/admin/Guestbook';

import AdminGuard from './components/admin/AdminGuard';
import AdminLayout from './components/admin/AdminLayout';

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  const isAdminArea =
    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen">
      {!isAdminArea && <Header />}

      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/family-tree"
          element={<FamilyTree />}
        />

        <Route
          path="/story"
          element={<Story />}
        />

        <Route
          path="/moments"
          element={<Gallery />}
        />

        <Route
          path="/guestbook"
          element={<Guestbook />}
        />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="families"
            element={<Families />}
          />

          <Route
            path="members"
            element={<Members />}
          />

          <Route
            path="relationships"
            element={<Relationships />}
          />

          <Route
            path="moments"
            element={<Moments />}
          />

          <Route
            path="guestbook"
            element={<GuestbookAdmin />}
          />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      {!isAdminArea && <Footer />}
    </div>
  );
}
