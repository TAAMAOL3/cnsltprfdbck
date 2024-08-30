import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';


const Feedback = () => {
  const [searchParams] = useSearchParams();
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [rating, setRating] = useState(null);  // Neues State für das Rating

  useEffect(() => {
    const feedbackId = searchParams.get('id');
    if (!feedbackId) {
      setError('Dieser Feedback Link ist leider ungültig.');
    } else {
      fetchCustomerFeedback(feedbackId);
    }
  }, [searchParams]);

  const fetchCustomerFeedback = async (feedbackId) => {
    try {
      const response = await axios.get(`/api/customerFeedback/${feedbackId}`);
      if (response.data) {
        if (response.data.customerFdbckAnswered === 1) {
          setSubmitted(true); // Direkt zur Erfolgsmeldung springen, wenn bereits beantwortet
        } else {
          setCompany(response.data.customerCompany);
          setContactPerson(response.data.customerName);
        }
      } else {
        setError('Dieser Feedback Link ist leider ungültig.');
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  // Funktion zur Textanalyse
  const analyzeText = async (text) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setRating(data.score);  // Speichere das Ergebnis der Analyse
      return data.score;
    } catch (error) {
      console.error('Fehler bei der Textanalyse:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedbackId = searchParams.get('id');
    const token = localStorage.getItem('token');

    // Textanalyse durchführen und Rating erhalten
    const analyzedRating = await analyzeText(feedback);

    try {
      await axios.put(`/api/customerFeedback/text/${feedbackId}`, {
        customerFdbckText: feedback,
        customerFdbckReceived: new Date(),
        customerFdbckAnswered: 1,
        rating: analyzedRating,  // Neues Rating-Feld
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSubmitted(true);

      setTimeout(() => {
        const formContainer = document.querySelector('.feedback-form-container');
        if (formContainer) {
          formContainer.style.display = 'none';
        }
      }, 1000);
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      {!submitted ? (
        <div className="feedback-form-container">
          <h2>Feedback Formular</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Kunden Firma</label>
              <input type="text" className="form-control" value={company} readOnly />
            </div>
            <div className="form-group">
              <label>Ansprechperson</label>
              <input type="text" className="form-control" value={contactPerson} readOnly />
            </div>
            <div className="form-group">
              <label>Feedback</label>
              <textarea
                className="form-control"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ihr Feedback"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn">Absenden</button>
          </form>
        </div>
      ) : (

        <div className="feedback-success-message" style={{ textAlign: 'center' }}>
          <div className="checkmark">&#10003;</div>
          <h3>Vielen Dank für Ihr Feedback! Sie können das Fenster nun schließen.</h3>
        </div>

      )}
    </div>
  );
};

export default Feedback;
