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

  return (
    <div className="mb-5">
      <h3>Team Feedback Requests</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Gesendet am</th>
            <th>Kundenunternehmen</th>
            <th>Kontaktperson</th>
            <th>E-Mail</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.customerFdbckID}>
                <td>{new Date(request.customerFdbckSend).toLocaleDateString('de-DE')}</td>
                <td>{request.customerCompany}</td>
                <td>{request.customerName}</td>
                <td>{request.customerMailaddr}</td>
                <td>
                  <button className="btn btn-primary">Erinnerung senden</button>
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
