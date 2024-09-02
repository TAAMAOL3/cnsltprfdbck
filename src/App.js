import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import Navigation from './Navigation';
import Login from './Login';
import Register from './Register';
import PasswordReset from './PasswordReset';
import Dashboard from './Dashboard';
import VariousFeedback from './variousFeedback';
import Admin from './Admin';
import TextMining from './TextMining';
import User from './User';
import CustomerFeedback from './customerFeedback';
import Feedback from './feedback';
import Team from './Team';
import Profile from './Profile';
import Status from "./Status";

// Layout-Komponente, die Header, Footer und Navigation bedingt rendert
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavigation = location.pathname === '/feedback';

  return (
    <>
      {!hideNavigation && <Navigation />}
      <div className="App">
        <main>{children}</main>
      </div>
    </>
  );
};

// Geschützte Route-Komponente, die den Zugriff auf authentifizierte Benutzer beschränkt
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { loading, user } = useContext(AuthContext);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/status" element={<Status />} />
            <Route path="/feedback" element={<Feedback />} />

            {/* Geschützte Routen */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/variousFeedback" element={<ProtectedRoute><VariousFeedback /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/textmining" element={<ProtectedRoute><TextMining /></ProtectedRoute>} />
            <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
            <Route path="/customerFeedback" element={<ProtectedRoute><CustomerFeedback /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />

            {/* Neue Profil-Route */}
            <Route path="/profile/:id" element={<ProtectedRoute><Profile user={user} /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
