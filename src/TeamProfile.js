import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // AuthContext importieren

const TeamProfile = ({ selectedTeamId }) => {
  const { user } = useContext(AuthContext); // user aus dem AuthContext extrahieren
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchTeamProfile = async () => {
      const teamId = selectedTeamId || user.teamId; // Verwende selectedTeamId, wenn vorhanden, sonst user.teamId
      if (teamId) {
        try {
          const response = await axios.get(`/api/profile/team/${teamId}`);
          setProfileData(response.data);
        } catch (error) {
          console.error('Fehler beim Laden des Teamprofils:', error);
        }
      }
    };

    fetchTeamProfile();
  }, [selectedTeamId, user]);

  const getRatingIcon = (rating) => {
    if (rating === null || rating === undefined) {
      return (
        <div className="rating-icon-wrapper">
          <img className="evaluation-img-extend" src="/Content/themes/base/images/Unknown.png" alt="Unknown" />
          <span className="rating-value">Keine Bewertung</span> {/* Fallback für keine Bewertung */}
        </div>
      );
    }
  
    let icon;
    if (rating >= 2.00) {
      icon = <img className="evaluation-img-extend" src="/Content/themes/base/images/VeryPositive.png" alt="Very Positive" />;
    } else if (rating >= 1.00 && rating < 2.00) {
      icon = <img className="evaluation-img-extend" src="/Content/themes/base/images/Positive.png" alt="Positive" />;
    } else if (rating >= -0.99 && rating <= 0.99) {
      icon = <img className="evaluation-img-extend" src="/Content/themes/base/images/Unknown.png" alt="Unknown" />;
    } else if (rating >= -1.99 && rating <= -1.00) {
      icon = <img className="evaluation-img-extend" src="/Content/themes/base/images/Negative.png" alt="Negative" />;
    } else if (rating <= -2.00) {
      icon = <img className="evaluation-img-extend" src="/Content/themes/base/images/VeryNegative.png" alt="Very Negative" />;
    }
  
    return (
      <div className="rating-icon-wrapper">
        {icon}
        <span className="rating-value">{rating.toFixed(2)}</span> {/* Wert mit zwei Nachkommastellen */}
      </div>
    );
  };

  if (!profileData) {
    return <div>Lade Teamprofil...</div>;
  }

  return (
    <div className="profile-container">
      {/* Y-Bereich: Name */}
      {/* <h3>{profileData.fullname}</h3> */}
      <h3><span></span></h3>

      {/* Z-Bereich: Profilbild */}
      {/* <img className="grimg" src="/Content/themes/base/images/userPlaceholder.png" alt="User icon" /> */}
      <h2 className="grimg">{profileData.fullname}</h2>

      {/* Grid-Inhalte */}
      <div className="grid-item">
        <p>Anzahl Kundenfeedbacks erhalten (aktueller Periode):</p>
        <p className="highlighted-text">{profileData.currentReceivedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>Anzahl Kundenfeedbacks angefragt (aktueller Periode):</p>
        <p className="highlighted-text">{profileData.currentRequestedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>Anzahl weiterer Feedbacks hochgeladen (aktueller Periode):</p>
        <p className="highlighted-text">{profileData.currentUploadedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>Durchschnittliche Bewertung (aktuelle Periode):</p>
        <p className="highlighted-text">{getRatingIcon(profileData.currentAvgRating)}</p>
      </div>

      <div className="grid-item">
        <p>Anzahl Kundenfeedbacks erhalten (gesamt):</p>
        <p className="highlighted-text">{profileData.totalReceivedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>Anzahl Kundenfeedbacks angefragt (gesamt):</p>
        <p className="highlighted-text">{profileData.totalRequestedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>Anzahl weiterer Feedbacks hochgeladen (gesamt):</p>
        <p className="highlighted-text">{profileData.totalUploadedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>Durchschnittliche Bewertung (gesamt):</p>
        <p className="highlighted-text">{getRatingIcon(profileData.totalAvgRating)}</p>
      </div>
    </div>
  );
};

export default TeamProfile;
