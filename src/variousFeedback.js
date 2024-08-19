import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the datepicker styles

const VariousFeedback = () => {
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [received, setReceived] = useState(new Date());
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('variousFdbckCustomer', customer);
    formData.append('variousFdbckDescription', description);
    formData.append('variousFdbckReceived', received.toLocaleDateString('de-DE')); // Format the date as dd.MM.yyyy
    formData.append('uploadUrl', file); // Datei hochladen

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('/api/feedback', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setMessage('Feedback erfolgreich hinzugefügt!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      setMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    }
  };

  return (
    <div className="container-fluid mt-5"> {/* Banner is full width */}
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/person_BOLD.svg" alt="Person icon" />
          </div>
          <hgroup className="title">
            <h1>Feedback Erfassen</h1>
          </hgroup>
        </div>
      </section>
      <div className="container mt-5"> {/* This keeps the form centered */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kunde</label>
            <input
              type="text"
              className="form-control"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Kundenname"
            />
          </div>
          <div className="form-group">
            <label>Beschreibung</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Feedback-Beschreibung"
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
          {message && <p>{message}</p>}
          <button type="submit" className="btn btn-primary">Feedback hinzufügen</button>
          <button type="button" className="btn btn-secondary ml-3" onClick={() => navigate('/dashboard')}>
            Abbrechen
          </button>
        </form>
      </div>
    </div>
  );

};

export default VariousFeedback;
