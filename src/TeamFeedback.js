import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { translate } from './translateFunction'; // Import the translate function

const TeamFeedback = ({ selectedTeam, selectedUser }) => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  // State for translations
  const [translations, setTranslations] = useState({
    teamFeedbackTitle: '',
    feedbackReceived: '',
    recipient: '',
    customer: '',
    description: '',
    actions: '',
    noFeedbackFound: '',
    view: '',
    noFile: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const teamFeedbackTitle = await translate(40); // "Team Feedback"
      const feedbackReceived = await translate(41); // "Feedback Erhalten"
      const recipient = await translate(42); // "Empfänger"
      const customer = await translate(43); // "Kunde"
      const description = await translate(44); // "Beschreibung"
      const actions = await translate(45); // "Aktionen"
      const noFeedbackFound = await translate(46); // "Keine Feedbacks gefunden."
      const view = await translate(47); // "Anzeigen"
      const noFile = await translate(48); // "Keine Datei"

      setTranslations({
        teamFeedbackTitle,
        feedbackReceived,
        recipient,
        customer,
        description,
        actions,
        noFeedbackFound,
        view,
        noFile
      });
    };

    loadTranslations();
  }, []);

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchTeamFeedback = async () => {
      const token = localStorage.getItem('token');
      const teamId = selectedTeam === 'all' ? 'all' : selectedTeam;

      if (selectedTeam) {
        try {
          const url = selectedUser && selectedUser !== 'all'
            ? `/api/team/feedback/${teamId}/${selectedUser}`
            : `/api/team/feedback/${teamId}`;

          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setFeedbacks(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Fehler beim Abrufen des Team-Feedbacks:', error);
          setFeedbacks([]);
        }
      }
    };

    fetchTeamFeedback();
  }, [selectedTeam, selectedUser]);

  const handleViewFeedback = (feedback) => {
    setViewingFeedback(feedback);
    setActiveRow(feedback.variousFdbckID);
  };

  return (
    <div className="mb-5">
      <h3>{translations.teamFeedbackTitle}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>{translations.feedbackReceived}</th>
            <th>{translations.recipient}</th>
            <th>{translations.customer}</th>
            <th>{translations.description}</th>
            <th>{translations.actions}</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => {
              const previousFeedback = feedbacks[index - 1];
              const currentYear = new Date(feedback.variousFdbckReceived).getFullYear();
              const previousYear = previousFeedback ? new Date(previousFeedback.variousFdbckReceived).getFullYear() : currentYear;

              const isNewYear = previousFeedback && currentYear < previousYear;

              return (
                <React.Fragment key={feedback.variousFdbckID}>
                  {isNewYear && <tr className="year-separator"></tr>}
                  <tr className={activeRow === feedback.variousFdbckID ? 'active' : ''}>
                    <td>{formatDateForDisplay(feedback.variousFdbckReceived)}</td>
                    <td>{feedback.usersName}</td>
                    <td>{feedback.variousFdbckCustomer}</td>
                    <td>{feedback.variousFdbckDescription}</td>
                    <td>
                      {feedback.uploadUrl ? (
                        <a href={feedback.uploadUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                          {translations.view}
                        </a>
                      ) : (
                        translations.noFile
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">{translations.noFeedbackFound}</td>
            </tr>
          )}
        </tbody>
      </table>

      {viewingFeedback && (
        <div className="mt-5">
          <h3>{translations.view}</h3>
          <p style={{ fontSize: '1.5rem' }}><strong>Feedback:</strong> {viewingFeedback.customerFdbckText}</p>
          <button className="btn btn-secondary" onClick={() => setViewingFeedback(null)}>Schließen</button>
        </div>
      )}
    </div>
  );
};

export default TeamFeedback;
