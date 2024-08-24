import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const TeamRequest = ({ selectedTeam, selectedUser }) => {
  const { user } = useContext(AuthContext); // Zugriff auf den aktuellen Benutzer
  const [requests, setRequests] = useState([]); // Liste der Feedback-Anfragen

  // Effekt, um die Feedback-Anfragen für das ausgewählte Team zu laden
  useEffect(() => {
    const fetchTeamRequests = async () => {
      const token = localStorage.getItem('token'); // Token für API-Anfragen
      if (selectedTeam && selectedTeam !== 'all') {
        try {
          // API-URL zum Abrufen der Feedback-Anfragen für das ausgewählte Team
          const url = selectedUser && selectedUser !== 'all'
            ? `/api/team/requests/${selectedTeam}/${selectedUser}`
            : `/api/team/requests/${selectedTeam}`;
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` } // Token für die Autorisierung
          });
          setRequests(response.data || []); // Feedback-Anfragen setzen
        } catch (error) {
          console.error('Fehler beim Abrufen der Feedback-Anfragen:', error);
          setRequests([]); // Bei Fehler leere Liste setzen
        }
      }
    };

    fetchTeamRequests(); // Feedback-Anfragen laden, wenn sich das Team ändert
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
            requests.map((request) => (
              <tr key={request.customerFdbckID}>
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
            ))
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
