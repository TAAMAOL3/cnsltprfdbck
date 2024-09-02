import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const TeamReceived = ({ selectedTeam, selectedUser }) => {
  const { user } = useContext(AuthContext);// eslint-disable-line no-use-before-define
  const [feedbacks, setFeedbacks] = useState([]);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [activeRow, setActiveRow] = useState(null); // Neuer Zustand für die aktive Zeile

  useEffect(() => {
    const fetchFilteredFeedbacks = async () => {
      const token = localStorage.getItem('token');
      const teamId = selectedTeam === 'all' ? 'all' : selectedTeam;

      if (selectedTeam) {
        try {
          const url = selectedUser && selectedUser !== 'all'
            ? `/api/team/received/${teamId}/${selectedUser}`
            : `/api/team/received/${teamId}`;

          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setFeedbacks(response.data || []); // Setze die erhaltenen Feedbacks
        } catch (error) {
          console.error('Fehler beim Abrufen der erhaltenen Team-Feedbacks:', error);
          setFeedbacks([]);
        }
      }
    };

    fetchFilteredFeedbacks();
  }, [selectedTeam, selectedUser]);

  const handleViewFeedback = (feedback) => {
    setViewingFeedback(feedback);
    setActiveRow(feedback.customerFdbckID); // Setzt die aktive Zeile
  };

  const handleCloseFeedback = () => {
    setViewingFeedback(null);
    setActiveRow(null); // Entfernt die aktive Zeile
  };

  const getRatingIcon = (rating) => {
    if (rating >= 2) {
      return <img className="evaluation-img" src="/Content/themes/base/images/VeryPositive.png" alt="Sehr positiv" />;
    } else if (rating === 1) {
      return <img className="evaluation-img" src="/Content/themes/base/images/Positive.png" alt="Positiv" />;
    } else if (rating === 0) {
      return <img className="evaluation-img" src="/Content/themes/base/images/Unknown.png" alt="Unbekannt" />;
    } else if (rating === -1) {
      return <img className="evaluation-img" src="/Content/themes/base/images/Negative.png" alt="Negativ" />;
    } else if (rating <= -2) {
      return <img className="evaluation-img" src="/Content/themes/base/images/VeryNegative.png" alt="Sehr negativ" />;
    }
  };

  return (
    <div className="mb-5">
      <h3>Erhaltene Team-Feedbacks</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Empfangen am</th>
            <th>Empfänger</th>
            <th>Kunde</th>
            <th>Kontaktperson</th>
            <th>Bewertung</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length > 0 ? (
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
                    <td>{feedback.usersName}</td>
                    <td>{feedback.customerCompany}</td>
                    <td>{feedback.customerName}</td>
                    <td>{getRatingIcon(feedback.rating)}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => handleViewFeedback(feedback)}>
                        Anzeigen
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">Keine Feedbacks gefunden.</td>
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

export default TeamReceived;
