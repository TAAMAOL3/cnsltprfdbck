import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { translate } from './translateFunction'; // Import the translate function

const TeamReceived = ({ selectedTeam, selectedUser }) => {
  // eslint-disable-next-line
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  // State for translations
  const [translations, setTranslations] = useState({
    teamReceivedTitle: '',
    receivedOn: '',
    recipient: '',
    customer: '',
    contactPerson: '',
    rating: '',
    actions: '',
    noFeedbacksFound: '',
    view: '',
    close: '',
    email: '',
    feedbackText: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const teamReceivedTitle = await translate(50); // "Erhaltene Team-Feedbacks"
      const receivedOn = await translate(51); // "Empfangen am"
      const recipient = await translate(52); // "Empfänger"
      const customer = await translate(53); // "Kunde"
      const contactPerson = await translate(54); // "Kontaktperson"
      const rating = await translate(55); // "Bewertung"
      const actions = await translate(56); // "Aktionen"
      const noFeedbacksFound = await translate(57); // "Keine Feedbacks gefunden."
      const view = await translate(58); // "Anzeigen"
      const close = await translate(59); // "Schließen"
      const email = await translate(60); // "E-Mail"
      const feedbackText = await translate(61); // "Feedback"

      setTranslations({
        teamReceivedTitle,
        receivedOn,
        recipient,
        customer,
        contactPerson,
        rating,
        actions,
        noFeedbacksFound,
        view,
        close,
        email,
        feedbackText
      });
    };

    loadTranslations();
  }, []);

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

          setFeedbacks(response.data || []);
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
    setActiveRow(feedback.customerFdbckID);
  };

  const handleCloseFeedback = () => {
    setViewingFeedback(null);
    setActiveRow(null);
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
      <h3>{translations.teamReceivedTitle}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>{translations.receivedOn}</th>
            <th>{translations.recipient}</th>
            <th>{translations.customer}</th>
            <th>{translations.contactPerson}</th>
            <th>{translations.rating}</th>
            <th>{translations.actions}</th>
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
                  <tr className={activeRow === feedback.customerFdbckID ? 'active' : ''}>
                    <td>{new Date(feedback.customerFdbckReceived).toLocaleDateString()}</td>
                    <td>{feedback.usersName}</td>
                    <td>{feedback.customerCompany}</td>
                    <td>{feedback.customerName}</td>
                    <td>{getRatingIcon(feedback.rating)}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => handleViewFeedback(feedback)}>
                        {translations.view}
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
          <h3>{translations.view}</h3>
          <p><strong>{translations.email}:</strong> {viewingFeedback.customerMailaddr}</p>
          <p><strong>{translations.rating}:</strong> {getRatingIcon(viewingFeedback.rating)}</p>
          <p style={{ fontSize: '1.5rem' }}><strong>{translations.feedbackText}:</strong> {viewingFeedback.customerFdbckText}</p>
          <button className="btn btn-secondary" onClick={handleCloseFeedback}>{translations.close}</button>
        </div>
      )}
    </div>
  );
};

export default TeamReceived;
