import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // AuthContext importieren
import { translate } from './translateFunction'; // Import the translate function

const TeamProfile = ({ selectedTeamId }) => {
  const { user } = useContext(AuthContext); // user aus dem AuthContext extrahieren
  const [profileData, setProfileData] = useState(null);
  const [translations, setTranslations] = useState({
    receivedFeedbackCurrent: '',
    requestedFeedbackCurrent: '',
    uploadedFeedbackCurrent: '',
    avgRatingCurrent: '',
    receivedFeedbackTotal: '',
    requestedFeedbackTotal: '',
    uploadedFeedbackTotal: '',
    avgRatingTotal: ''
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const receivedFeedbackCurrent = await translate(400); // "Anzahl Kundenfeedbacks erhalten (aktueller Periode)"
      const requestedFeedbackCurrent = await translate(401); // "Anzahl Kundenfeedbacks angefragt (aktueller Periode)"
      const uploadedFeedbackCurrent = await translate(402); // "Anzahl weiterer Feedbacks hochgeladen (aktueller Periode)"
      const avgRatingCurrent = await translate(403); // "Durchschnittliche Bewertung (aktuelle Periode)"
      const receivedFeedbackTotal = await translate(404); // "Anzahl Kundenfeedbacks erhalten (gesamt)"
      const requestedFeedbackTotal = await translate(405); // "Anzahl Kundenfeedbacks angefragt (gesamt)"
      const uploadedFeedbackTotal = await translate(406); // "Anzahl weiterer Feedbacks hochgeladen (gesamt)"
      const avgRatingTotal = await translate(407); // "Durchschnittliche Bewertung (gesamt)"

      setTranslations({
        receivedFeedbackCurrent,
        requestedFeedbackCurrent,
        uploadedFeedbackCurrent,
        avgRatingCurrent,
        receivedFeedbackTotal,
        requestedFeedbackTotal,
        uploadedFeedbackTotal,
        avgRatingTotal
      });
    };

    loadTranslations();
  }, []);

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
      {/* <h3>{profileData.teamname}</h3> */}
      <h3><span></span></h3>

      {/* Z-Bereich: Profilbild */}
      {/* <img className="grimg" src="/Content/themes/base/images/userPlaceholder.png" alt="User icon" /> */}
      <h2 className="grimg">{profileData.teamname}</h2>

      {/* Grid-Inhalte */}
      <div className="grid-item">
        <p>{translations.receivedFeedbackCurrent}</p>
        <p className="highlighted-text">{profileData.currentReceivedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>{translations.requestedFeedbackCurrent}</p>
        <p className="highlighted-text">{profileData.currentRequestedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>{translations.uploadedFeedbackCurrent}</p>
        <p className="highlighted-text">{profileData.currentUploadedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>{translations.avgRatingCurrent}</p>
        <p className="highlighted-text">{getRatingIcon(profileData.currentAvgRating)}</p>
      </div>

      <div className="grid-item">
        <p>{translations.receivedFeedbackTotal}</p>
        <p className="highlighted-text">{profileData.totalReceivedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>{translations.requestedFeedbackTotal}</p>
        <p className="highlighted-text">{profileData.totalRequestedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>{translations.uploadedFeedbackTotal}</p>
        <p className="highlighted-text">{profileData.totalUploadedFeedback}</p>
      </div>

      <div className="grid-item">
        <p>{translations.avgRatingTotal}</p>
        <p className="highlighted-text">{getRatingIcon(profileData.totalAvgRating)}</p>
      </div>
    </div>
  );
};

export default TeamProfile;