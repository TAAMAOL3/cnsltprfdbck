import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { translate } from './translateFunction'; // Übersetzungsfunktion importieren

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  // eslint-disable-next-line
  const [rating, setRating] = useState(null);  // Neues State für das Rating
  const [translations, setTranslations] = useState({
    invalidLink: '',
    feedbackFormTitle: '',
    customerCompanyLabel: '',
    contactPersonLabel: '',
    feedbackPlaceholder: '',
    submitButton: '',
    successMessage: '',
    errorOccurred: ''
  });

  // Laden der Übersetzungen analog zu Login.js
  useEffect(() => {
    const loadTranslations = async () => {
      const invalidLink = await translate(410); // "Dieser Feedback Link ist leider ungültig."
      const feedbackFormTitle = await translate(411); // "Feedback Formular"
      const customerCompanyLabel = await translate(412); // "Kunden Firma"
      const contactPersonLabel = await translate(413); // "Ansprechperson"
      const feedbackPlaceholder = await translate(414); // "Ihr Feedback"
      const submitButton = await translate(415); // "Absenden"
      const successMessage = await translate(416); // "Vielen Dank für Ihr Feedback! Sie können das Fenster nun schließen."
      const errorOccurred = await translate(417); // "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."

      setTranslations({
        invalidLink,
        feedbackFormTitle,
        customerCompanyLabel,
        contactPersonLabel,
        feedbackPlaceholder,
        submitButton,
        successMessage,
        errorOccurred
      });
    };

    loadTranslations();

    const feedbackId = searchParams.get('id');
    if (!feedbackId) {
      setError(translations.invalidLink);
    } else {
      fetchCustomerFeedback(feedbackId);
    }
    // eslint-disable-next-line
  }, [searchParams, translations.invalidLink, fetchCustomerFeedback]);

  const fetchCustomerFeedback = useCallback(async (feedbackId) => {
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
        setError(translations.invalidLink);
      }
    } catch (error) {
      setError(translations.errorOccurred);
    }
  }, [translations.invalidLink, translations.errorOccurred]);

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
        rating: analyzedRating  // Neues Rating-Feld
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
      setError(translations.errorOccurred);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      {!submitted ? (
        <div className="feedback-form-container">
          <h2>{translations.feedbackFormTitle}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{translations.customerCompanyLabel}</label>
              <input type="text" className="form-control" value={company} readOnly />
            </div>
            <div className="form-group">
              <label>{translations.contactPersonLabel}</label>
              <input type="text" className="form-control" value={contactPerson} readOnly />
            </div>
            <div className="form-group">
              <label>{translations.feedbackPlaceholder}</label>
              <textarea
                className="form-control"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={translations.feedbackPlaceholder}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn">{translations.submitButton}</button>
          </form>
        </div>
      ) : (
        <div className="feedback-success-message" style={{ textAlign: 'center' }}>
          <div className="checkmark">&#10003;</div>
          <h3>{translations.successMessage}</h3>
        </div>
      )}
    </div>
  );
};

export default Feedback;
