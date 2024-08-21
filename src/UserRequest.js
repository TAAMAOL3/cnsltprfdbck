import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const UserRequest = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [deletingRequestId, setDeletingRequestId] = useState(null); // Zustandsvariable für die Löschbestätigung

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      if (token && user && user.id) {
        try {
          const response = await axios.get(`/api/customerFeedback/user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRequests(response.data || []);
        } catch (error) {
          console.error('Fehler beim Abrufen der Feedback-Anfragen:', error);
          setRequests([]);
        }
      }
    };

    fetchRequests();
  }, [user]);

  const handleEdit = (request) => {
    setEditingRequest(request);
    setCompany(request.customerCompany);
    setContactPerson(request.customerName);
    setEmail(request.customerMailaddr);
  };

  const handleSaveRequest = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/customerFeedback/${editingRequest.customerFdbckID}`, {
        customerCompany: company,
        customerName: contactPerson,
        customerMailaddr: email,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(requests.map(req =>
        req.customerFdbckID === editingRequest.customerFdbckID ? { ...req, customerCompany: company, customerName: contactPerson, customerMailaddr: email } : req
      ));
      setEditingRequest(null);
      setMessage('Feedback-Anfrage erfolgreich aktualisiert!');
    } catch (error) {
      console.error('Fehler beim Speichern der Feedback-Anfrage:', error);
    }
  };

  const handleDeleteRequest = async (requestID) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/customerFeedback/${requestID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(req => req.customerFdbckID !== requestID));
      setDeletingRequestId(null); // Zurücksetzen der Löschbestätigung
    } catch (error) {
      console.error('Fehler beim Löschen der Feedback-Anfrage:', error);
    }
  };

  const confirmDelete = (requestID) => {
    setDeletingRequestId(requestID); // Setze die zu löschende Anfrage
  };

  const cancelDelete = () => {
    setDeletingRequestId(null); // Setze das Löschbestätigungs-Flag zurück
  };

  const handleRemind = (request) => {
    const sendDate = new Date(request.customerFdbckSend).toLocaleDateString();
    const mailtoLink = `mailto:${request.customerMailaddr}?subject=Erinnerung%20an%20Feedback%20vom%20${sendDate}&body=Sehr%20geehrter%20Herr%20${request.customerName},%0A%0A${request.customerFdbckUrl}%0A%0AFreundliche%20Grüsse%0A${user.firstName}%20${user.lastName}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="mb-5">
      <h3>Offene Feedback-Anfragen</h3>
      {message && <p>{message}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Gesendet am</th>
            <th>Kunden Firma</th>
            <th>Ansprechperson</th>
            <th>E-Mail</th>
            <th>Feedback URL</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(requests) && requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.customerFdbckID}>
                <td>{new Date(request.customerFdbckSend).toLocaleDateString()}</td>
                <td>{request.customerCompany}</td>
                <td>{request.customerName}</td>
                <td>{request.customerMailaddr}</td>
                <td>
                  <a href={request.customerFdbckUrl} download className="btn btn-link">
                    Feedback öffnen
                  </a>
                </td>
                <td>
                  {deletingRequestId === request.customerFdbckID ? (
                    <>
                      <button className="btn btn-danger mr-2" onClick={() => handleDeleteRequest(request.customerFdbckID)}>
                        Wirklich löschen?
                      </button>
                      <button className="btn btn-secondary" onClick={cancelDelete}>
                        Abbrechen
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary mr-2" onClick={() => handleEdit(request)}>Bearbeiten</button>
                      <button className="btn btn-danger mr-2" onClick={() => confirmDelete(request.customerFdbckID)}>
                        Löschen
                      </button>
                      <button className="btn btn-warning" onClick={() => handleRemind(request)}>Erinnern</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Keine Feedback-Anfragen gefunden.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingRequest && (
        <div className="mt-5">
          <h3>Feedback-Anfrage bearbeiten</h3>
          <div className="form-group">
            <label>Kunden Firma</label>
            <input
              type="text"
              className="form-control"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Ansprechperson</label>
            <input
              type="text"
              className="form-control"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>E-Mail</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSaveRequest}>Speichern</button>
          <button className="btn btn-secondary ml-2" onClick={() => setEditingRequest(null)}>Abbrechen</button>
        </div>
      )}
    </div>
  );
};

export default UserRequest;
