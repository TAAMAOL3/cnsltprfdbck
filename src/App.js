import React, { useContext, useState } from 'react';
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
import Status from './Status';
import NewPassword from './NewPassword'; // Neue Passwort-Änderungsseite importieren
import { translate, setLanguage } from './translateFunction'; // Import translate and setLanguage functions

// Layout-Komponente, die Header, Footer und Navigation bedingt rendert
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavigation = location.pathname === '/feedback' || location.pathname === '/change-password';
  const { user } = useContext(AuthContext);
  const [currentLanguage, setCurrentLanguageState] = useState('DE'); // Default language

  const handleLanguageChange = (lang) => {
    setCurrentLanguageState(lang);
    setLanguage(lang); // Change the global language using the setLanguage function from translateFunction.js
    // Force a reload of translations to apply the new language
    window.location.reload();
  };

  return (
    <>
      {!hideNavigation && <Navigation />}
      <div className="App">
        <main>{children}</main>
        <footer className="container-fluid footer-custom">
          <div className="flex-div-legend">
            <img src="/Content/themes/base/images/logo.png" alt="Logo" />
            <div className="flex-vertical">
              <p>  Consulting Feedback <br/>
              Swisscom Business | Analytics & Data</p>
            </div>
          </div>
          <div className="language-selection">
            <a href="#" onClick={() => handleLanguageChange('DE')}>Deutsch</a> |
            <a href="#" onClick={() => handleLanguageChange('EN')}>English</a> |
            <a href="#" onClick={() => handleLanguageChange('FR')}>Français</a>
          </div>
        </footer>
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

            {/* Neue Route für Passwortänderung */}
            <Route path="/change-password" element={<ProtectedRoute><NewPassword /></ProtectedRoute>} />

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
