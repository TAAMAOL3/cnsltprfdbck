import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const UserReceived = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [viewingFeedback, setViewingFeedback] = useState(null);

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

  const handleViewFeedback = (feedback) => {
    setViewingFeedback(feedback);
  };

  const getRatingIcon = (rating) => {
    if (rating >= 2) {
      return <img className="page-icon" src="/Content/themes/base/images/VeryPositive.png" alt="Very Positive" />;
    } else if (rating === 1) {
      return <img className="page-icon" src="/Content/themes/base/images/Positive.png" alt="Positive" />;
    } else if (rating === 0) {
      return <img className="page-icon" src="/Content/themes/base/images/Unknown.png" alt="Unknown" />;
    } else if (rating === -1) {
      return <img className="page-icon" src="/Content/themes/base/images/Negative.png" alt="Negative" />;
    } else if (rating <= -2) {
      return <img className="page-icon" src="/Content/themes/base/images/VeryNegative.png" alt="Very Negative" />;
    }
  };

  return (
    <div className="mb-5">
      <h3>Erhaltene Feedbacks</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Erhalten am</th>
            <th>Kunden Firma</th>
            <th>Ansprechperson</th>
            <th>E-Mail</th>
            <th>Bewertung</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <tr key={feedback.customerFdbckID}>
                <td>{new Date(feedback.customerFdbckReceived).toLocaleDateString('de-DE')}</td>
                <td>{feedback.customerCompany}</td>
                <td>{feedback.customerName}</td>
                <td>{feedback.customerMailaddr}</td>
                <td>{getRatingIcon(feedback.rating)}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleViewFeedback(feedback)}>
                    Anzeigen
                  </button>
                </td>
              </tr>
            ))
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
          <p style={{ fontSize: '1.5rem' }}><strong>Feedback:</strong> {viewingFeedback.customerFdbckText}</p>
          <button className="btn btn-secondary" onClick={() => setViewingFeedback(null)}>Schließen</button>
        </div>
      )}
    </div>
  );
};

export default UserReceived;
