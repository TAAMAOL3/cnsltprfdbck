import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { translate } from './translateFunction'; // Import the translate function

const UserReceived = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  // State for translations
  const [translations, setTranslations] = useState({
    receivedFeedbackTitle: '',
    receivedOn: '',
    customer: '',
    contactPerson: '',
    email: '',
    rating: '',
    actions: '',
    noFeedbacksFound: '',
    viewButton: '',
    closeButton: '',
    feedbackLabel: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const receivedFeedbackTitle = await translate(230); // "Erhaltene Feedbacks"
      const receivedOn = await translate(231); // "Erhalten am"
      const customer = await translate(232); // "Kunde"
      const contactPerson = await translate(233); // "Ansprechperson"
      const email = await translate(234); // "E-Mail"
      const rating = await translate(235); // "Bewertung"
      const actions = await translate(236); // "Aktionen"
      const noFeedbacksFound = await translate(237); // "Keine erhaltenen Feedbacks gefunden."
      const viewButton = await translate(238); // "Anzeigen"
      const closeButton = await translate(239); // "Schließen"
      const feedbackLabel = await translate(240); // "Feedback"

      setTranslations({
        receivedFeedbackTitle,
        receivedOn,
        customer,
        contactPerson,
        email,
        rating,
        actions,
        noFeedbacksFound,
        viewButton,
        closeButton,
        feedbackLabel
      });
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem('token');
      if (token && user && user.id) {
        try {
          const response = await axios.get(`/api/customerFeedback/userReceived/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFeedbacks(response.data || []);
        } catch (error) {
          console.error('Fehler beim Abrufen der erhaltenen Feedbacks:', error);
          setFeedbacks([]);
        }
      }
    };

    fetchFeedbacks();
  }, [user]);

  const handleViewFeedback = (feedback, feedbackId) => {
    setViewingFeedback(feedback);
    setActiveRow(feedbackId);
  };

  const handleCloseFeedback = () => {
    setViewingFeedback(null);
    setActiveRow(null);
  };

  const getRatingIcon = (rating) => {
    if (rating >= 2) {
      return <img className="evaluation-img" src="/Content/themes/base/images/VeryPositive.png" alt={translations.rating} />;
    } else if (rating === 1) {
      return <img className="evaluation-img" src="/Content/themes/base/images/Positive.png" alt={translations.rating} />;
    } else if (rating === 0) {
      return <img className="evaluation-img" src="/Content/themes/base/images/Unknown.png" alt={translations.rating} />;
    } else if (rating === -1) {
      return <img className="evaluation-img" src="/Content/themes/base/images/Negative.png" alt={translations.rating} />;
    } else if (rating <= -2) {
      return <img className="evaluation-img" src="/Content/themes/base/images/VeryNegative.png" alt={translations.rating} />;
    }
  };

  return (
    <div className="mb-5">
      <h3>{translations.receivedFeedbackTitle}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>{translations.receivedOn}</th>
            <th>{translations.customer}</th>
            <th>{translations.contactPerson}</th>
            <th>{translations.email}</th>
            <th>{translations.rating}</th>
            <th>{translations.actions}</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => {
              const previousFeedback = feedbacks[index - 1];
              const currentYear = new Date(feedback.customerFdbckReceived).getFullYear();
              const previousYear = previousFeedback ? new Date(previousFeedback.customerFdbckReceived).getFullYear() : currentYear;

              const isNewYear = previousFeedback && currentYear < previousYear;

              return (
                <React.Fragment key={feedback.customerFdbckID}>
                  {isNewYear && <tr className="year-separator"></tr>}
                  <tr
                    className={activeRow === feedback.customerFdbckID ? 'active' : ''}
                  >
                    <td>{new Date(feedback.customerFdbckReceived).toLocaleDateString()}</td>
                    <td>{feedback.customerCompany}</td>
                    <td>{feedback.customerName}</td>
                    <td>{feedback.customerMailaddr}</td>
                    <td>{getRatingIcon(feedback.rating)}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => handleViewFeedback(feedback, feedback.customerFdbckID)}>
                        {translations.viewButton}
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">{translations.noFeedbacksFound}</td>
            </tr>
          )}
        </tbody>
      </table>

      {viewingFeedback && (
        <div className="mt-5">
          <h3>{translations.viewButton}</h3>
          <p><strong>{translations.email}:</strong> {viewingFeedback.customerMailaddr}</p>
          <p><strong>{translations.rating}:</strong> {getRatingIcon(viewingFeedback.rating)}</p>
          <p style={{ fontSize: '1.5rem' }}><strong>{translations.feedbackLabel}:</strong> {viewingFeedback.customerFdbckText}</p>
          <button className="btn btn-secondary" onClick={handleCloseFeedback}>{translations.closeButton}</button>
        </div>
      )}
    </div>
  );
};

export default UserReceived;
