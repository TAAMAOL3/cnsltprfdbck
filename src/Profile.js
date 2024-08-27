import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // AuthContext importieren


const Profile = () => {
  const { user } = useContext(AuthContext); // user aus dem AuthContext extrahieren
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`/api/profile/${user.id}`);
          setProfileData(response.data);
        } catch (error) {
          console.error('Fehler beim Laden des Profils:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const getRatingIcon = (rating) => {
    let icon;
    if (rating >= 2.00) {
      icon = <img className="evaluation-img" src="/Content/themes/base/images/VeryPositive.png" alt="Very Positive" />;
    } else if (rating >= 1.00 && rating < 2.00) {
      icon = <img className="evaluation-img" src="/Content/themes/base/images/Positive.png" alt="Positive" />;
    } else if (rating >= -0.99 && rating <= 0.99) {
      icon = <img className="evaluation-img" src="/Content/themes/base/images/Unknown.png" alt="Unknown" />;
    } else if (rating >= -1.99 && rating <= -1.00) {
      icon = <img className="evaluation-img" src="/Content/themes/base/images/Negative.png" alt="Negative" />;
    } else if (rating <= -2.00) {
      icon = <img className="evaluation-img" src="/Content/themes/base/images/VeryNegative.png" alt="Very Negative" />;
    }

    return (
      <div className="rating-icon-wrapper">
        {icon}
        <span className="rating-value">{rating.toFixed(2)}</span> {/* Wert mit zwei Nachkommastellen */}
      </div>
    );
  };

  if (!profileData) {
    return <div>Lade Benutzerprofil...</div>;
  }

  return (
    <div className="profile-container">
      {/* A-Bereich: Name */}
      <div className="profile-name">
        <h3>{profileData.fullname}</h3>
      </div>

      {/* B-Bereich: Profilbild */}
      <div className="profile-image">
        <img src="/Content/themes/base/images/person_BOLD.svg" alt="User icon" />
      </div>

      {/* C-Bereich: Erste 3 Texte */}
      <div className="profile-section-text">
        <ul className="list-unstyled">
          <li>Anzahl Kundenfeedbacks erhalten (aktueller Periode):</li>
          <li>Anzahl Kundenfeedbacks angefragt (aktueller Periode):</li>
          <li>Anzahl weiterer Feedbacks hochgeladen (aktueller Periode):</li>
        </ul>
      </div>

      {/* D-Bereich: Ergebnisse zu den ersten 3 Texten */}
      <div className="profile-section-values">
        <ul className="list-unstyled">
          <li className="font-weight-bold">{profileData.currentReceivedFeedback}</li>
          <li className="font-weight-bold">{profileData.currentRequestedFeedback}</li>
          <li className="font-weight-bold">{profileData.currentUploadedFeedback}</li>
        </ul>
      </div>

      {/* E-Bereich: Zweite 3 Texte */}
      <div className="profile-section-text">
        <ul className="list-unstyled">
          <li>Anzahl Kundenfeedbacks erhalten (gesamt):</li>
          <li>Anzahl Kundenfeedbacks angefragt (gesamt):</li>
          <li>Anzahl weiterer Feedbacks hochgeladen (gesamt):</li>
        </ul>
      </div>

      {/* F-Bereich: Ergebnisse zu den zweiten 3 Texten */}
      <div className="profile-section-values">
        <ul className="list-unstyled">
          <li className="font-weight-bold">{profileData.totalReceivedFeedback}</li>
          <li className="font-weight-bold">{profileData.totalRequestedFeedback}</li>
          <li className="font-weight-bold">{profileData.totalUploadedFeedback}</li>
        </ul>
      </div>

      {/* G-Bereich: Letzte 2 Texte (Bewertungen) */}
      <div className="profile-section-text">
        <ul className="list-unstyled">
          <li>Durchschnittliche Bewertung (aktuelle Periode):</li>
          <li>Durchschnittliche Bewertung (gesamt):</li>
        </ul>
      </div>

      {/* G-Bereich: Ergebnisse zu den letzten 2 Texten (Bewertungen) */}
      <div className="profile-section-values">
        <ul className="list-unstyled">
          <li>{getRatingIcon(profileData.currentAvgRating)}</li>
          <li>{getRatingIcon(profileData.totalAvgRating)}</li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
