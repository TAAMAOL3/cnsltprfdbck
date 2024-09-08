import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { translate } from './translateFunction'; // Import the translate function

const UserFeedback = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [received, setReceived] = useState('');
  const [message, setMessage] = useState('');
  const [deletingFeedbackId, setDeletingFeedbackId] = useState(null);

  // State for translations
  const [translations, setTranslations] = useState({
    myFeedbacksTitle: '',
    feedbackReceived: '',
    customerLabel: '',
    descriptionLabel: '',
    fileLabel: '',
    actionsLabel: '',
    noFeedbacksFound: '',
    editButton: '',
    deleteButton: '',
    confirmDeleteButton: '',
    cancelButton: '',
    saveButton: '',
    editFeedbackTitle: '',
    view: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const myFeedbacksTitle = await translate(210); // "Meine Feedbacks"
      const feedbackReceived = await translate(211); // "Feedback Erhalten"
      const customerLabel = await translate(212); // "Kunde"
      const descriptionLabel = await translate(213); // "Beschreibung"
      const fileLabel = await translate(214); // "Datei"
      const actionsLabel = await translate(215); // "Aktionen"
      const noFeedbacksFound = await translate(216); // "Keine Feedbacks gefunden."
      const editButton = await translate(217); // "Bearbeiten"
      const deleteButton = await translate(218); // "Löschen"
      const confirmDeleteButton = await translate(219); // "Wirklich löschen?"
      const cancelButton = await translate(220); // "Abbrechen"
      const saveButton = await translate(221); // "Speichern"
      const editFeedbackTitle = await translate(222); // "Feedback bearbeiten"
      const view = await translate(47); // "Feedback bearbeiten"

      setTranslations({
        myFeedbacksTitle,
        feedbackReceived,
        customerLabel,
        descriptionLabel,
        fileLabel,
        actionsLabel,
        noFeedbacksFound,
        editButton,
        deleteButton,
        confirmDeleteButton,
        cancelButton,
        saveButton,
        editFeedbackTitle,
        view
      });
    };

    loadTranslations();
  }, []);

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
    setActiveRow(feedback.variousFdbckID);
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
      setActiveRow(null);
      setMessage(translations.saveSuccessMessage);
    } catch (error) {
      console.error('Fehler beim Speichern des Feedbacks:', error.message || error);
    }
  };

  const handleCancelEdit = () => {
    setEditingFeedback(null);
    setActiveRow(null);
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
      <h3>{translations.myFeedbacksTitle}</h3>
      {message && <p>{message}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>{translations.feedbackReceived}</th>
            <th>{translations.customerLabel}</th>
            <th>{translations.descriptionLabel}</th>
            <th>{translations.fileLabel}</th>
            <th>{translations.actionsLabel}</th>
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
                      <a href={feedback.uploadUrl} target="_blank" className="btn btn-link">
                        {translations.view}
                      </a>
                    </td>
                    <td>
                      {deletingFeedbackId === feedback.variousFdbckID ? (
                        <>
                          <button className="btn btn-danger mr-2" onClick={() => handleDeleteFeedback(feedback.variousFdbckID)}>
                            {translations.confirmDeleteButton}
                          </button>
                          <button className="btn btn-secondary" onClick={cancelDelete}>
                            {translations.cancelButton}
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary mr-2" onClick={() => handleEdit(feedback)}>{translations.editButton}</button>
                          <button className="btn btn-danger mr-2" onClick={() => confirmDelete(feedback.variousFdbckID)}>
                            {translations.deleteButton}
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
              <td colSpan="5">{translations.noFeedbacksFound}</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingFeedback && (
        <div className="mt-5">
          <h3>{translations.editFeedbackTitle}</h3>
          <div className="form-group">
            <label>{translations.customerLabel}</label>
            <input
              type="text"
              className="form-control"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{translations.descriptionLabel}</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{translations.feedbackReceived}</label>
            <input
              type="date"
              className="form-control"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSaveFeedback}>{translations.saveButton}</button>
          <button className="btn btn-secondary ml-2" onClick={handleCancelEdit}>{translations.cancelButton}</button>
        </div>
      )}
    </div>
  );
};

export default UserFeedback;
