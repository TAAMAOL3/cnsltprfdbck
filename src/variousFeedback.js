import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const VariousFeedback = () => {
  const { user } = useContext(AuthContext); // eslint-disable-line no-use-before-define
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [received, setReceived] = useState(new Date());
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Zustand für das Absenden des Formulars
  const [submitted, setSubmitted] = useState(false); // Zustand, um die Erfolgsmeldung anzuzeigen
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Deaktiviert den Button während des Absendevorgangs

    const formData = new FormData();
    formData.append('variousFdbckCustomer', customer);
    formData.append('variousFdbckDescription', description);
    formData.append('variousFdbckReceived', formatDateForInput(received)); // Formatieren des Datums
    formData.append('uploadUrl', file); // Datei hochladen

    const token = localStorage.getItem('token');

    try {
      await axios.post('/api/feedback', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmitted(true); // Zeigt die Erfolgsmeldung an

      setTimeout(() => {
        setIsSubmitting(false); // Setzt den Absendevorgang zurück
      }, 1000);
    } catch (error) {
      console.error('Ein Fehler ist aufgetreten:', error.response?.data || error.message);
      alert(error.response?.data || 'Fehler beim Hochladen der Datei. Erlaubte Formate: PNG, JPEG, PDF.');
      setIsSubmitting(false); // Setzt den Absendevorgang zurück
    }
    setTimeout(() => {
      navigate('/user');
    }, 3000);
  };

  return (
    <div className="container-fluid mt-5">
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/DB.png" alt="Person icon" />
          </div>
          <hgroup className="title">
            <h1>Feedback Erfassen</h1>
            <p>Lade hier Dateien mit Feedbacks hoch, die du ausserhalb des Tools erhalten hast.</p>
          </hgroup>
        </div>
      </section>
      <div className="container mt-5">
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Kunde</label>
              <input
                type="text"
                className="form-control"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Kundenname"
                required
              />
            </div>
            <div className="form-group">
              <label>Beschreibung</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Feedback-Beschreibung"
                required
              />
            </div>
            <div className="form-group">
              <label>Erhalten am</label>
              <DatePicker
                selected={received}
                onChange={(date) => setReceived(date)}
                dateFormat="dd.MM.yyyy"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Datei hochladen (Bilder, PDFs, E-Mails)</label>
              <input type="file" className="form-control" onChange={handleFileChange} />
            </div>
            <button
              type="submit"
              className="btn btn-primary button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Absenden...' : 'Feedback hinzufügen'}
            </button>
            {!isSubmitting && (
              <button type="button" className="btn btn-secondary ml-3" onClick={() => navigate('/user')}>
                Abbrechen
              </button>
            )}
          </form>
        ) : (
          <div className="feedback-success-message" style={{ textAlign: 'center' }}>
            <div className="checkmark">&#10003;</div>
            <h3>Feedback erfolgreich erfasst.
              <br />
              Du wirst in Kürze weitergeleitet.</h3>

          </div>
        )}
      </div>
    </div>
  );
};

export default VariousFeedback;
