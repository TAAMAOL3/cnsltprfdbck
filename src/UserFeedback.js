import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const UserFeedback = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [activeRow, setActiveRow] = useState(null); // Neuer Zustand für aktive Zeile
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [received, setReceived] = useState('');
  const [message, setMessage] = useState('');
  const [deletingFeedbackId, setDeletingFeedbackId] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem('token');
      if (token && user && user.id) {
        try {
          const response = await axios.get(`/api/feedback/user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFeedbacks(response.data || []);
        } catch (error) {
          console.error('Fehler beim Abrufen der Feedbacks:', error);
          setFeedbacks([]);
        }
      }
    };

    fetchFeedbacks();
  }, [user]);

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setActiveRow(feedback.variousFdbckID); // Setzt die aktive Zeile
    setCustomer(feedback.variousFdbckCustomer);
    setDescription(feedback.variousFdbckDescription);
    setReceived(formatDateForInput(feedback.variousFdbckReceived)); 
  };

  const handleSaveFeedback = async () => {
    const token = localStorage.getItem('token');
    try {
      const formattedDate = received.split('/').reverse().join('-');
  
      await axios.put(`/api/feedback/${editingFeedback.variousFdbckID}`, {
        variousFdbckCustomer: customer,
        variousFdbckDescription: description,
        variousFdbckReceived: formattedDate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setFeedbacks(feedbacks.map(fb =>
        fb.variousFdbckID === editingFeedback.variousFdbckID ? { ...fb, variousFdbckCustomer: customer, variousFdbckDescription: description, variousFdbckReceived: formattedDate } : fb
      ));
      setEditingFeedback(null);
      setActiveRow(null); // Entfernt die aktive Zeile nach dem Speichern
      setMessage('Feedback erfolgreich aktualisiert!');
    } catch (error) {
      console.error('Fehler beim Speichern des Feedbacks:', error.message || error);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingFeedback(null);
    setActiveRow(null); // Entfernt die aktive Zeile nach dem Abbrechen
  };
  

  const handleDeleteFeedback = async (feedbackID) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/feedback/${feedbackID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(feedbacks.filter(fb => fb.variousFdbckID !== feedbackID));
      setDeletingFeedbackId(null);
    } catch (error) {
      console.error('Fehler beim Löschen des Feedbacks:', error);
    }
  };

  const confirmDelete = (feedbackID) => {
    setDeletingFeedbackId(feedbackID);
  };

  const cancelDelete = () => {
    setDeletingFeedbackId(null);
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
          {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => {
              const previousFeedback = feedbacks[index - 1];
              const currentYear = new Date(feedback.variousFdbckReceived).getFullYear();
              const previousYear = previousFeedback ? new Date(previousFeedback.variousFdbckReceived).getFullYear() : currentYear;

              const isNewYear = previousFeedback && currentYear < previousYear;

              return (
                <React.Fragment key={feedback.variousFdbckID}>
                  {isNewYear && <tr className="year-separator"></tr>}
                  <tr
                    className={activeRow === feedback.variousFdbckID ? 'active' : ''}
                  >
                    <td>{formatDateForDisplay(feedback.variousFdbckReceived)}</td>
                    <td>{feedback.variousFdbckCustomer}</td>
                    <td>{feedback.variousFdbckDescription}</td>
                    <td>
                      <a href={feedback.uploadUrl} download className="btn btn-link">
                        Datei herunterladen
                      </a>
                    </td>
                    <td>
                      {deletingFeedbackId === feedback.variousFdbckID ? (
                        <>
                          <button className="btn btn-danger mr-2" onClick={() => handleDeleteFeedback(feedback.variousFdbckID)}>
                            Wirklich löschen?
                          </button>
                          <button className="btn btn-secondary" onClick={cancelDelete}>
                            Abbrechen
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary mr-2" onClick={() => handleEdit(feedback)}>Bearbeiten</button>
                          <button className="btn btn-danger mr-2" onClick={() => confirmDelete(feedback.variousFdbckID)}>
                            Löschen
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
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
          <button className="btn btn-secondary ml-2" onClick={handleCancelEdit}>Abbrechen</button>
        </div>
      )}
    </div>
  );
};

export default UserFeedback;
