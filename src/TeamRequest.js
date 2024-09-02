import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const TeamRequest = ({ selectedTeam, selectedUser }) => {
  const { user } = useContext(AuthContext); // Zugriff auf den aktuellen Benutzer
  const [requests, setRequests] = useState([]); // Liste der Feedback-Anfragen
  // eslint-disable-next-line no-unused-vars
  const [activeRow, setActiveRow] = useState(null); // eslint-disable-line no-use-before-define

  useEffect(() => {
    const fetchTeamRequests = async () => {
      const token = localStorage.getItem('token'); // Token für die API-Anfrage

      const teamId = selectedTeam === 'all' ? 'all' : selectedTeam;

      if (selectedTeam) {
        try {
          const url = selectedUser && selectedUser !== 'all'
            ? `/api/team/requests/${teamId}/${selectedUser}`
            : `/api/team/requests/${teamId}`;

          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` } // Autorisierungs-Token
          });

          setRequests(response.data || []); // Setze die Anfragen oder eine leere Liste
        } catch (error) {
          console.error('Fehler beim Abrufen der Team-Requests:', error);
          setRequests([]); // Bei Fehler die Liste leeren
        }
      }
    };

    fetchTeamRequests(); // Aufruf der Funktion bei Änderung der Abhängigkeiten
  }, [selectedTeam, selectedUser]);

  // Funktion, um eine E-Mail-Erinnerung zu senden
  const handleRemind = (request) => {
    const sendDate = new Date(request.customerFdbckSend).toLocaleDateString();
    const mailtoLink = `mailto:${request.customerMailaddr}?subject=Erinnerung%20an%20Feedback%20vom%20${sendDate}&body=Sehr%20geehrter%20Herr%20${request.customerName},%0A%0A${request.customerFdbckUrl}%0A%0AFreundliche%20Grüsse%0A${user.firstName}%20${user.lastName}`;
    window.location.href = mailtoLink; // E-Mail-Link öffnen
  };

  return (
    <div className="mb-5">
      <h3>Team Feedback Requests</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Gesendet am</th>
            <th>Ersteller</th>
            <th>Kunde</th>
            <th>Kontaktperson</th>
            <th>Aktionen</th>
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
                  <tr
                    className={activeRow === request.customerFdbckID ? 'active' : ''}
                  >
                    <td>{new Date(request.customerFdbckSend).toLocaleDateString()}</td>
                    <td>{request.usersName}</td>
                    <td>{request.customerCompany}</td>
                    <td>{request.customerName}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => handleRemind(request)}>
                        Erinnerung senden
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">Keine Feedback-Anfragen gefunden.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamRequest;
