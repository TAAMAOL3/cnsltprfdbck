import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { translate } from './translateFunction'; // Import the translate function

function Navigation() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const redirectPath = await logout();
    navigate(redirectPath);
  };

  const [translations, setTranslations] = React.useState({
    login: '',
    feedbackCollect: '',
    feedbackCapture: '',
    myFeedbacks: '',
    allFeedbacks: '',
    admin: '',
    logout: ''
  });

  React.useEffect(() => {
    const loadTranslations = async () => {
      const login = await translate(300); // "Login"
      const feedbackCollect = await translate(301); // "Feedback einholen"
      const feedbackCapture = await translate(302); // "Feedback Erfassen"
      const myFeedbacks = await translate(303); // "Meine Feedbacks"
      const allFeedbacks = await translate(304); // "Alle Feedbacks"
      const admin = await translate(305); // "Admin"
      const logout = await translate(306); // "Ausloggen"

      setTranslations({
        login,
        feedbackCollect,
        feedbackCapture,
        myFeedbacks,
        allFeedbacks,
        admin,
        logout
      });
    };

    loadTranslations();
  }, []);

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
              <li><Link to="/login">{translations.login}</Link></li>
            ) : (
              <>
                <li><Link to="/customerFeedback">{translations.feedbackCollect}</Link></li>
                <li><Link to="/variousFeedback">{translations.feedbackCapture}</Link></li>
                <li><Link to="/User">{translations.myFeedbacks}</Link></li>

                {/* Show "Alle Feedbacks" only if the user has role 2 or 3 */}
                {(user.role === 2 || user.role === 3) && (
                  <li><Link to="/team">{translations.allFeedbacks}</Link></li>
                )}

                {user.role === 3 && (
                  <li><Link to="/admin">{translations.admin}</Link></li>
                )}
                <li><Link to="#" onClick={handleLogout}>{translations.logout}</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
