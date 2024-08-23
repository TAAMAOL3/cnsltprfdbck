import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const TeamReceived = ({ selectedTeam, selectedUser }) => {
  const { user } = useContext(AuthContext); // Zugriff auf den aktuellen Benutzer
  const [feedbacks, setFeedbacks] = useState([]); // Liste der erhaltenen Feedbacks
  const [viewingFeedback, setViewingFeedback] = useState(null); // Angezeigtes Feedback-Detail

  // Effekt, um die Feedback-Daten basierend auf dem ausgewählten Team und Benutzer zu laden
  useEffect(() => {
    const fetchFilteredFeedbacks = async () => {
      const token = localStorage.getItem('token'); // Token für API-Anfragen
      if (selectedTeam && selectedTeam !== 'all') { 
        try {
          // URL für das Abrufen der Feedbacks für das ausgewählte Team und Benutzer
          const url = selectedUser && selectedUser !== 'all'
            ? `/api/team/received/${selectedTeam}/${selectedUser}`
            : `/api/team/received/${selectedTeam}`;
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` } // Token zur Autorisierung
          });
          setFeedbacks(response.data || []); // Feedbacks setzen
        } catch (error) {
          console.error('Fehler beim Abrufen der erhaltenen Team-Feedbacks:', error);
          setFeedbacks([]); // Bei Fehler leere Liste setzen
        }
      }
    };

    fetchFilteredFeedbacks(); // Abruf, wenn sich Team oder Benutzer ändern
  }, [selectedTeam, selectedUser]);

  // Funktion zum Anzeigen der Details eines spezifischen Feedbacks
  const handleViewFeedback = (feedback) => {
    setViewingFeedback(feedback); // Angezeigtes Feedback setzen
  };

  // Funktion, um das passende Icon basierend auf der Bewertung zu erhalten
  const getRatingIcon = (rating) => {
    if (rating >= 2) {
      return <img className="page-icon" src="/Content/themes/base/images/VeryPositive.png" alt="Sehr positiv" />;
    } else if (rating === 1) {
      return <img className="page-icon" src="/Content/themes/base/images/Positive.png" alt="Positiv" />;
    } else if (rating === 0) {
      return <img className="page-icon" src="/Content/themes/base/images/Unknown.png" alt="Unbekannt" />;
    } else if (rating === -1) {
      return <img className="page-icon" src="/Content/themes/base/images/Negative.png" alt="Negativ" />;
    } else if (rating <= -2) {
      return <img className="page-icon" src="/Content/themes/base/images/VeryNegative.png" alt="Sehr negativ" />;
    }
  };

  return (
    <div className="mb-5">
      <h3>Erhaltene Team-Feedbacks</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Empfangen am</th>
            <th>Kundenunternehmen</th>
            <th>Kontaktperson</th>
            <th>E-Mail</th>
            <th>Bewertung</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length > 0 ? ( 
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
              <td colSpan="6">Keine Feedbacks gefunden.</td> 
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

export default TeamReceived;
