import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [rating, setRating] = useState(null);
  const navigate = useNavigate();

  const fetchCustomerFeedback = useCallback(async () => {
    const feedbackId = searchParams.get('id');
    try {
      const response = await axios.get(`/api/customerFeedback/${feedbackId}`);

      if (response.data) {
        setCompany(response.data.customerCompany);
        setContactPerson(response.data.customerName);
      } else {
        setError('Dieser Feedback Link ist leider ungültig.');
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  }, [searchParams]);

  useEffect(() => {
    const feedbackId = searchParams.get('id');
    if (!feedbackId) {
      setError('Dieser Feedback Link ist leider ungültig.');
    } else {
      fetchCustomerFeedback(feedbackId);
    }
  }, [fetchCustomerFeedback]);

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
      setRating(data.score);
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

    const analyzedRating = await analyzeText(feedback);

    try {
      await axios.put(`/api/customerFeedback/text/${feedbackId}`, {
        customerFdbckText: feedback,
        customerFdbckReceived: new Date(),
        customerFdbckAnswered: 1,
        rating: analyzedRating,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      navigate('/feedback-success');
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
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
  );
};

export default Feedback;
