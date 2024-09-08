import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { translate } from './translateFunction'; // Import the translate function

const Profile = ({ selectedUserId }) => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);

  // State for translations
  const [translations, setTranslations] = useState({
    receivedFeedbackCurrent: '',
    requestedFeedbackCurrent: '',
    uploadedFeedbackCurrent: '',
    avgRatingCurrent: '',
    receivedFeedbackTotal: '',
    requestedFeedbackTotal: '',
    uploadedFeedbackTotal: '',
    avgRatingTotal: '',
    loadingProfile: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const receivedFeedbackCurrent = await translate(90); // "Anzahl Kundenfeedbacks erhalten (aktueller Periode):"
      const requestedFeedbackCurrent = await translate(91); // "Anzahl Kundenfeedbacks angefragt (aktueller Periode):"
      const uploadedFeedbackCurrent = await translate(92); // "Anzahl weiterer Feedbacks hochgeladen (aktueller Periode):"
      const avgRatingCurrent = await translate(93); // "Durchschnittliche Bewertung (aktuelle Periode):"
      const receivedFeedbackTotal = await translate(94); // "Anzahl Kundenfeedbacks erhalten (gesamt):"
      const requestedFeedbackTotal = await translate(95); // "Anzahl Kundenfeedbacks angefragt (gesamt):"
      const uploadedFeedbackTotal = await translate(96); // "Anzahl weiterer Feedbacks hochgeladen (gesamt):"
      const avgRatingTotal = await translate(97); // "Durchschnittliche Bewertung (gesamt):"
      const loadingProfile = await translate(98); // "Lade Benutzerprofil..."

      setTranslations({
        receivedFeedbackCurrent,
        requestedFeedbackCurrent,
        uploadedFeedbackCurrent,
        avgRatingCurrent,
        receivedFeedbackTotal,
        requestedFeedbackTotal,
        uploadedFeedbackTotal,
        avgRatingTotal,
        loadingProfile
      });
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = selectedUserId || user.id;
      if (userId) {
        try {
          const response = await axios.get(`/api/profile/${userId}`);
          setProfileData(response.data);
        } catch (error) {
          console.error('Fehler beim Laden des Profils:', error);
        }
      }
    };

    fetchUserProfile();
  }, [selectedUserId, user]);

  const getRatingIcon = (rating) => {
    if (rating === null || rating === undefined) {
      return (
        <div className="rating-icon-wrapper">
          <img className="evaluation-img-extend" src="/Content/themes/base/images/Unknown.png" alt="Unknown" />
          <span className="rating-value">{translations.noRating}</span>
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
        <span className="rating-value">{rating.toFixed(2)}</span>
      </div>
    );
  };

  if (!profileData) {
    return <div>{translations.loadingProfile}</div>;
  }

  return (
 <div className="profile-container">

      <h3><span></span></h3>

      <h2 className="grimg">{profileData.fullname}</h2>


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

export default Profile;
