import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Navigation() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const redirectPath = await logout();
    navigate(redirectPath);
  };

  if (loading) {
    return null; // Show a loader if necessary
  }

  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <a href="/" className="navbar-brand">
            <img src="/dist/img/sc_logo.png" id="sc-logo" alt="swisscom-logo" />
          </a>
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse" id="navbar-main">
          <ul className="nav navbar-nav navbar-right">
            {!user ? (
              <li><Link to="/login">Login</Link></li>
            ) : (
              <>
                <li><Link to="/customerFeedback">Feedback einholen</Link></li>
                <li><Link to="/variousFeedback">Feedback Erfassen</Link></li>
                <li><Link to="/User">Meine Feedbacks</Link></li>
                <li><Link to="/teamleader">Alle Feedbacks</Link></li>
                {user.role === 3 && (
                  <li><Link to="/admin">Admin</Link></li>
                )}
                <li><Link to="#" onClick={handleLogout}>Ausloggen</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
