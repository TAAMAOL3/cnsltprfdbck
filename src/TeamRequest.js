import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { translate } from './translateFunction'; // Import the translate function

const TeamRequest = ({ selectedTeam, selectedUser }) => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [activeRow, setActiveRow] = useState(null);

  // State for translations
  const [translations, setTranslations] = useState({
    teamRequestsTitle: '',
    sentOn: '',
    createdBy: '',
    customer: '',
    contactPerson: '',
    actions: '',
    noRequestsFound: '',
    sendReminder: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const teamRequestsTitle = await translate(30); // "Team Feedback Requests"
      const sentOn = await translate(31); // "Gesendet am"
      const createdBy = await translate(32); // "Ersteller"
      const customer = await translate(33); // "Kunde"
      const contactPerson = await translate(34); // "Kontaktperson"
      const actions = await translate(35); // "Aktionen"
      const noRequestsFound = await translate(36); // "Keine Feedback-Anfragen gefunden."
      const sendReminder = await translate(37); // "Erinnerung senden"

      setTranslations({
        teamRequestsTitle,
        sentOn,
        createdBy,
        customer,
        contactPerson,
        actions,
        noRequestsFound,
        sendReminder
      });
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    const fetchTeamRequests = async () => {
      const token = localStorage.getItem('token');
      const teamId = selectedTeam === 'all' ? 'all' : selectedTeam;

      if (selectedTeam) {
        try {
          const url = selectedUser && selectedUser !== 'all'
            ? `/api/team/requests/${teamId}/${selectedUser}`
            : `/api/team/requests/${teamId}`;

          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setRequests(response.data || []);
        } catch (error) {
          console.error('Fehler beim Abrufen der Team-Requests:', error);
          setRequests([]);
        }
      }
    };

    fetchTeamRequests();
  }, [selectedTeam, selectedUser]);

  const handleRemind = (request) => {
    const sendDate = new Date(request.customerFdbckSend).toLocaleDateString();
    const mailtoLink = `mailto:${request.customerMailaddr}?subject=Erinnerung%20an%20Feedback%20vom%20${sendDate}&body=Sehr%20geehrter%20Herr%20${request.customerName},%0A%0A${request.customerFdbckUrl}%0A%0AFreundliche%20Grüsse%0A${user.firstName}%20${user.lastName}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="mb-5">
      <h3>{translations.teamRequestsTitle}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>{translations.sentOn}</th>
            <th>{translations.createdBy}</th>
            <th>{translations.customer}</th>
            <th>{translations.contactPerson}</th>
            <th>{translations.actions}</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request, index) => {
              const previousRequest = requests[index - 1];
              const currentYear = new Date(request.customerFdbckSend).getFullYear();
              const previousYear = previousRequest ? new Date(previousRequest.customerFdbckSend).getFullYear() : currentYear;
              const isNewYear = previousRequest && currentYear < previousYear;

              return (
                <React.Fragment key={request.customerFdbckID}>
                  {isNewYear && <tr className="year-separator"></tr>}
                  <tr className={activeRow === request.customerFdbckID ? 'active' : ''}>
                    <td>{new Date(request.customerFdbckSend).toLocaleDateString()}</td>
                    <td>{request.usersName}</td>
                    <td>{request.customerCompany}</td>
                    <td>{request.customerName}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => handleRemind(request)}>
                        {translations.sendReminder}
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">{translations.noRequestsFound}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamRequest;
