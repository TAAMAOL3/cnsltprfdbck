import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import AdminUser from './AdminUser';
import AdminRole from './AdminRole';
import AdminTeam from './AdminTeam';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Stelle sicher, dass nur Admins Zugriff haben
  useEffect(() => {
    if (!user || user.role !== 3) {
      navigate('/user'); // Nicht-Admin-Benutzer weiterleiten
    }
  }, [user, navigate]);

  return (
    <div className="container-fluid mt-5"> {/* Full width for the banner */}
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/person_BOLD.svg" alt="Admin icon" />
          </div>
          <hgroup className="title">
            <h1>Adminbereich</h1>
          </hgroup>
        </div>
      </section>
      <div className="container mt-5"> {/* Centered content for the rest */}
        {/* Benutzerverwaltung */}
        <AdminUser />

        {/* Rollenverwaltung */}
        <AdminRole />

        {/* Teamverwaltung */}
        <AdminTeam />
      </div>
    </div>
  );
};

export default Admin;
