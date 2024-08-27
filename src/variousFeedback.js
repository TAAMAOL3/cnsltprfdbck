import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Assuming you're using AuthContext for the logged-in user
// eslint-disable-next-line no-unused-vars
import LinkGenerator from './linkGenerator'; // Use the LinkGenerator for generating the link
import { animateButton } from './buttonAnimations'; // Import the button animation function
import './buttonAnimations.scss'; // Import the SCSS for the animations
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the datepicker styles

const VariousFeedback = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useContext(AuthContext); // Assuming you're using AuthContext to get the logged-in user
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [received, setReceived] = useState(new Date());
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle form submission
  const [hideCancel, setHideCancel] = useState(false); // State to hide the "Abbrechen" button
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]'); // Get the submit button

    setIsSubmitting(true); // Disable the button while submitting
    setHideCancel(true); // Hide the "Abbrechen" button

    const formData = new FormData();
    formData.append('variousFdbckCustomer', customer);
    formData.append('variousFdbckDescription', description);
    formData.append('variousFdbckReceived', received.toLocaleDateString()); // Format the date as dd.MM.yyyy
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
        // Trigger the success animation only for the submit button
        animateButton(submitButton, 'success');

        setTimeout(() => {
          navigate('/user');
        }, 3000);
      }
    } catch (error) {
      console.error('Ein Fehler ist aufgetreten:', error.response?.data || error.message);
      animateButton(submitButton, 'error');
      alert(error.response?.data || 'Fehler beim Hochladen der Datei. Erlaubte Formate: PNG, JPEG, PDF.');
    } finally {
      setIsSubmitting(false); // Re-enable the button after the submission
    }
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
          {!hideCancel && (
            <button type="button" className="btn btn-secondary ml-3" onClick={() => navigate('/user')}>
              Abbrechen
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default VariousFeedback;
