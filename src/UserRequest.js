import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { translate } from './translateFunction'; // Import the translate function

const UserRequest = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [activeRow, setActiveRow] = useState(null); 
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [deletingRequestId, setDeletingRequestId] = useState(null);

  // State for translations
  const [translations, setTranslations] = useState({
    openFeedbackRequests: '',
    sentOn: '',
    customerCompany: '',
    contactPerson: '',
    emailAddress: '',
    feedbackUrl: '',
    actions: '',
    noRequestsFound: '',
    editButton: '',
    deleteButton: '',
    confirmDeleteButton: '',
    remindButton: '',
    saveButton: '',
    cancelButton: '',
    editRequestTitle: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const openFeedbackRequests = await translate(190); // "Offene Feedback-Anfragen"
      const sentOn = await translate(191); // "Gesendet am"
      const customerCompany = await translate(192); // "Kunden Firma"
      const contactPerson = await translate(193); // "Ansprechperson"
      const emailAddress = await translate(194); // "E-Mail"
      const feedbackUrl = await translate(195); // "Feedback URL"
      const actions = await translate(196); // "Aktionen"
      const noRequestsFound = await translate(197); // "Keine Feedback-Anfragen gefunden."
      const editButton = await translate(198); // "Bearbeiten"
      const deleteButton = await translate(199); // "Löschen"
      const confirmDeleteButton = await translate(200); // "Wirklich löschen?"
      const remindButton = await translate(201); // "Erinnern"
      const saveButton = await translate(202); // "Speichern"
      const cancelButton = await translate(203); // "Abbrechen"
      const editRequestTitle = await translate(204); // "Feedback-Anfrage bearbeiten"

      setTranslations({
        openFeedbackRequests,
        sentOn,
        customerCompany,
        contactPerson,
        emailAddress,
        feedbackUrl,
        actions,
        noRequestsFound,
        editButton,
        deleteButton,
        confirmDeleteButton,
        remindButton,
        saveButton,
        cancelButton,
        editRequestTitle
      });
    };

    loadTranslations();
  }, []);

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
    setActiveRow(request.customerFdbckID); 
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
      setActiveRow(null); 
      setMessage(translations.successMessage);
    } catch (error) {
      console.error('Fehler beim Speichern der Feedback-Anfrage:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingRequest(null);
    setActiveRow(null); 
  };

  const handleDeleteRequest = async (requestID) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/customerFeedback/${requestID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(req => req.customerFdbckID !== requestID));
      setDeletingRequestId(null);
    } catch (error) {
      console.error('Fehler beim Löschen der Feedback-Anfrage:', error);
    }
  };

  const confirmDelete = (requestID) => {
    setDeletingRequestId(requestID);
  };

  const cancelDelete = () => {
    setDeletingRequestId(null);
  };

  const handleRemind = (request) => {
    const sendDate = new Date(request.customerFdbckSend).toLocaleDateString();
    const mailtoLink = `mailto:${request.customerMailaddr}?subject=Erinnerung%20an%20Feedback%20vom%20${sendDate}&body=Sehr%20geehrter%20Herr%20${request.customerName},%0A%0A${request.customerFdbckUrl}%0A%0AFreundliche%20Grüsse%0A${user.firstName}%20${user.lastName}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="mb-5">
      <h3>{translations.openFeedbackRequests}</h3>
      {message && <p>{message}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>{translations.sentOn}</th>
            <th>{translations.customerCompany}</th>
            <th>{translations.contactPerson}</th>
            <th>{translations.emailAddress}</th>
            <th>{translations.feedbackUrl}</th>
            <th>{translations.actions}</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(requests) && requests.length > 0 ? (
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
                    <td>{request.customerCompany}</td>
                    <td>{request.customerName}</td>
                    <td>{request.customerMailaddr}</td>
                    <td>
                      <a href={request.customerFdbckUrl} target="_blank" rel="noreferrer" className="btn btn-link">
                        Feedback öffnen
                      </a>
                    </td>
                    <td>
                      {deletingRequestId === request.customerFdbckID ? (
                        <>
                          <button className="btn btn-danger mr-2" onClick={() => handleDeleteRequest(request.customerFdbckID)}>
                            {translations.confirmDeleteButton}
                          </button>
                          <button className="btn btn-secondary" onClick={cancelDelete}>
                            {translations.cancelButton}
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary mr-2" onClick={() => handleEdit(request)}>{translations.editButton}</button>
                          <button className="btn btn-danger mr-2" onClick={() => confirmDelete(request.customerFdbckID)}>
                            {translations.deleteButton}
                          </button>
                          <button className="btn btn-warning" onClick={() => handleRemind(request)}>{translations.remindButton}</button>
                        </>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">{translations.noRequestsFound}</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingRequest && (
        <div className="mt-5">
          <h3>{translations.editRequestTitle}</h3>
          <div className="form-group">
            <label>{translations.customerCompany}</label>
            <input
              type="text"
              className="form-control"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{translations.contactPerson}</label>
            <input
              type="text"
              className="form-control"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{translations.emailAddress}</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSaveRequest}>{translations.saveButton}</button>
          <button className="btn btn-secondary ml-2" onClick={handleCancelEdit}>{translations.cancelButton}</button>
        </div>
      )}
    </div>
  );
};

export default UserRequest;
