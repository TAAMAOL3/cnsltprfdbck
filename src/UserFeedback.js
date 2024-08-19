import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const UserFeedback = () => {
  const { user } = useContext(AuthContext);  // Hole die Benutzerdaten aus dem AuthContext
  const [feedbacks, setFeedbacks] = useState([]);  // Initialisiere feedbacks als leeres Array
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [received, setReceived] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem('token');
      if (token && user && user.id) {  // Stelle sicher, dass der Token und die user.id vorhanden sind
        try {
          const response = await axios.get(`/api/feedback/user/${user.id}`, {  // Füge die user.id zur Anfrage hinzu
            headers: { Authorization: `Bearer ${token}` }
          });
          setFeedbacks(response.data || []);  // Füge ein Fallback hinzu, falls keine Daten zurückkommen
        } catch (error) {
          console.error('Fehler beim Abrufen der Feedbacks:', error);
          setFeedbacks([]);  // Falls ein Fehler auftritt, setze feedbacks auf ein leeres Array
        }
      }
    };

    fetchFeedbacks();
  }, [user]);  // Füge user als Abhängigkeit hinzu, um sicherzustellen, dass die Daten geladen werden, sobald der Benutzer verfügbar ist

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setCustomer(feedback.variousFdbckCustomer);
    setDescription(feedback.variousFdbckDescription);
    
    // Das Datum in das richtige Format bringen (YYYY-MM-DD) für das Eingabefeld
    const formattedDate = new Date(feedback.variousFdbckReceived).toISOString().split('T')[0];
    setReceived(formattedDate);
  };

  const handleSaveFeedback = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/feedback/${editingFeedback.variousFdbckID}`, {
        variousFdbckCustomer: customer,
        variousFdbckDescription: description,
        variousFdbckReceived: received,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFeedbacks(feedbacks.map(fb => 
        fb.variousFdbckID === editingFeedback.variousFdbckID ? { ...fb, variousFdbckCustomer: customer, variousFdbckDescription: description, variousFdbckReceived: received } : fb
      ));
      setEditingFeedback(null);
      setMessage('Feedback erfolgreich aktualisiert!');
    } catch (error) {
      console.error('Fehler beim Speichern des Feedbacks:', error);
    }
  };

  const handleDeleteFeedback = async (feedbackID) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/feedback/${feedbackID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(feedbacks.filter(fb => fb.variousFdbckID !== feedbackID));
    } catch (error) {
      console.error('Fehler beim Löschen des Feedbacks:', error);
    }
  };

  const handleDownloadFile = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="mb-5">
      <h3>Meine Feedbacks</h3>
      {message && <p>{message}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Feedback Erhalten</th>
            <th>Kunde</th>
            <th>Beschreibung</th>
            <th>Datei</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(feedbacks) && feedbacks.length > 0 ? (  // Überprüfe, ob feedbacks ein Array ist
            feedbacks.map((feedback) => (
              <tr key={feedback.variousFdbckID}>
                <td>{new Date(feedback.variousFdbckReceived).toLocaleDateString()}</td>
                <td>{feedback.variousFdbckCustomer}</td>
                <td>{feedback.variousFdbckDescription}</td>
                <td>
                  <a href={feedback.uploadUrl} download className="btn btn-link">
                    Datei herunterladen
                  </a>
                </td>
                <td>
                  <button className="btn btn-primary mr-2" onClick={() => handleEdit(feedback)}>Bearbeiten</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteFeedback(feedback.variousFdbckID)}>
                    Löschen
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Keine Feedbacks gefunden.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingFeedback && (
        <div className="mt-5">
          <h3>Feedback bearbeiten</h3>
          <div className="form-group">
            <label>Kunde</label>
            <input
              type="text"
              className="form-control"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Beschreibung</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Erhalten am</label>
            <input
              type="date"
              className="form-control"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSaveFeedback}>Speichern</button>
          <button className="btn btn-secondary ml-2" onClick={() => setEditingFeedback(null)}>Abbrechen</button>
        </div>
      )}
    </div>
  );
};

export default UserFeedback;
