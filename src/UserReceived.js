import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const UserReceived = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [activeRow, setActiveRow] = useState(null); // Neuer Zustand für die aktive Zeile

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
    setActiveRow(feedbackId); // Setzt die aktive Zeile
  };

  const handleCloseFeedback = () => {
    setViewingFeedback(null);
    setActiveRow(null); // Entfernt die aktive Zeile
  };

  const getRatingIcon = (rating) => {
    if (rating >= 2) {
      return <img className="evaluation-img" src="/Content/themes/base/images/VeryPositive.png" alt="Very Positive" />;
    } else if (rating === 1) {
      return <img className="evaluation-img" src="/Content/themes/base/images/Positive.png" alt="Positive" />;
    } else if (rating === 0) {
      return <img className="evaluation-img" src="/Content/themes/base/images/Unknown.png" alt="Unknown" />;
    } else if (rating === -1) {
      return <img className="evaluation-img" src="/Content/themes/base/images/Negative.png" alt="Negative" />;
    } else if (rating <= -2) {
      return <img className="evaluation-img" src="/Content/themes/base/images/VeryNegative.png" alt="Very Negative" />;
    }
  };

  return (
    <div className="mb-5">
      <h3>Erhaltene Feedbacks</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Erhalten am</th>
            <th>Kunde</th>
            <th>Ansprechperson</th>
            <th>E-Mail</th>
            <th>Bewertung</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => {
              const previousFeedback = feedbacks[index - 1];
              const currentYear = new Date(feedback.customerFdbckReceived).getFullYear();
              const previousYear = previousFeedback ? new Date(previousFeedback.customerFdbckReceived).getFullYear() : currentYear;
              console.log('currentYear:', currentYear, 'previousYear:', previousYear);

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
                        Anzeigen
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">Keine erhaltenen Feedbacks gefunden.</td>
            </tr>
          )}
        </tbody>
      </table>

      {viewingFeedback && (
        <div className="mt-5">
          <h3>Feedback anzeigen</h3>
          <p><strong>E-Mail:</strong> {viewingFeedback.customerMailaddr}</p>
          <p><strong>Bewertung:</strong> {getRatingIcon(viewingFeedback.rating)}</p>
          <p style={{ fontSize: '1.5rem' }}><strong>Feedback:</strong> {viewingFeedback.customerFdbckText}</p>
          <button className="btn btn-secondary" onClick={handleCloseFeedback}>Schließen</button>
        </div>
      )}
    </div>
  );
};

export default UserReceived;
