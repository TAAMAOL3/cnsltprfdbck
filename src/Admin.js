import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import AdminUser from './AdminUser';
import AdminRole from './AdminRole';
import AdminTeam from './AdminTeam';
import { translate } from './translateFunction'; // Import the translate function

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for translations
  const [translations, setTranslations] = useState({
    adminTitle: '',
    adminDescription: '',
    adminIconAlt: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const adminTitle = await translate(100); // "Adminbereich"
      const adminDescription = await translate(101); // "Verwaltung von Benutzern, Rollen und Teams"
      const adminIconAlt = await translate(102); // "Admin icon"

      setTranslations({
        adminTitle,
        adminDescription,
        adminIconAlt
      });
    };

    loadTranslations();
  }, []);

  // Ensure only admins have access
  useEffect(() => {
    if (!user || user.role !== 3) {
      navigate('/user'); // Redirect non-admin users
    }
  }, [user, navigate]);

  return (
    <div className="container-fluid mt-5"> {/* Full width for the banner */}
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/Config.png" alt={translations.adminIconAlt} />
          </div>
          <hgroup className="title">
            <h1>{translations.adminTitle}</h1>
            <p>{translations.adminDescription}</p>
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
