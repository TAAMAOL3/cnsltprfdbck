import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Feedback from './feedback'; // Importing the new Feedback component

// ProtectedRoute component to restrict access to authenticated users
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const { loading } = useContext(AuthContext); 

  if (loading) {
    return <div>Lade Benutzerdaten...</div>; 
  }

  return (
    <Router>
      <AuthProvider>
        <div>
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/variousFeedback" element={<ProtectedRoute><VariousFeedback /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/textmining" element={<ProtectedRoute><TextMining /></ProtectedRoute>} />
            <Route path="/User" element={<ProtectedRoute><User /></ProtectedRoute>} />
            <Route path="/customerFeedback" element={<ProtectedRoute><CustomerFeedback /></ProtectedRoute>} /> 

            {/* New route for feedback */}
            <Route path="/feedback" element={<Feedback />} /> 
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
