import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Assuming you're using AuthContext for the logged-in user
import LinkGenerator from './linkGenerator'; // Use the LinkGenerator for generating the link
import { animateButton } from './buttonAnimations'; // Import the button animation function
import { translate } from './translateFunction'; // Import the translate function
import './buttonAnimations.scss'; // Import the SCSS for the animations

const CustomerFeedback = () => {
  const { user } = useContext(AuthContext); 
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [hideCancel, setHideCancel] = useState(false); 
  const navigate = useNavigate();

  // State for translations
  const [translations, setTranslations] = useState({
    feedbackRequestTitle: '',
    fillFields: '',
    customerCompanyLabel: '',
    contactPersonLabel: '',
    emailLabel: '',
    generateFeedbackRequest: '',
    cancel: '',
    submitting: ''
  });

  // Load translations when the component mounts
  React.useEffect(() => {
    const loadTranslations = async () => {
      const feedbackRequestTitle = await translate(70); // "Feedback Anfrage generieren"
      const fillFields = await translate(71); // "Folgende Felder ausfüllen, um den Feedback-Link zu generieren."
      const customerCompanyLabel = await translate(72); // "Kunden Firma"
      const contactPersonLabel = await translate(73); // "Ansprechperson"
      const emailLabel = await translate(74); // "E-Mail"
      const generateFeedbackRequest = await translate(75); // "Feedback Anfrage generieren"
      const cancel = await translate(76); // "Abbrechen"
      const submitting = await translate(77); // "Absenden..."

      setTranslations({
        feedbackRequestTitle,
        fillFields,
        customerCompanyLabel,
        contactPersonLabel,
        emailLabel,
        generateFeedbackRequest,
        cancel,
        submitting
      });
    };

    loadTranslations();
  }, []);

  // Function to generate the feedback URL
  const handleGenerateLink = () => {
    const randomString = LinkGenerator.randomString(10); 
    const host = process.env.REACT_APP_URL_HOST; 
    const link = `${host}/feedback?id=${randomString}`;
    return { link, randomString };
  };

  // Function to handle form submission and insert the feedback into the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]'); 

    setIsSubmitting(true); 
    setHideCancel(true); 

    const { link, randomString } = handleGenerateLink(); 

    const token = localStorage.getItem('token');
    const currentDate = new Date().toISOString().split('T')[0]; 

    try {
      const response = await axios.post('/api/customerFeedback', {
        customerCompany: company,
        customerName: contactPerson,
        customerMailaddr: email,
        customerFdbckSend: currentDate,
        customerFdbckText: null,
        customerFdbckReceived: null,
        customerFdbckUrl: link, 
        customerFdbckUrlID: randomString, 
        customerFdbckAnswered: 0,
        usersFK: user.id,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        animateButton(submitButton, 'success');

        setTimeout(() => {
          navigate('/user');
        }, 3000);
      }
    } catch (error) {
      console.error('Ein Fehler ist aufgetreten:', error);
      animateButton(submitButton, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid mt-5">
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/Speak.png" alt="Speak icon" />
          </div>
          <hgroup className="title">
            <h1>{translations.feedbackRequestTitle}</h1>
            <p>{translations.fillFields}</p>
          </hgroup>
        </div>
      </section>

      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{translations.customerCompanyLabel}</label>
            <input
              type="text"
              className="form-control"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={translations.customerCompanyLabel}
              required
            />
          </div>
          <div className="form-group">
            <label>{translations.contactPersonLabel}</label>
            <input
              type="text"
              className="form-control"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder={translations.contactPersonLabel}
              required
            />
          </div>
          <div className="form-group">
            <label>{translations.emailLabel}</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={translations.emailLabel}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary button"
            disabled={isSubmitting}
          >
            {isSubmitting ? translations.submitting : translations.generateFeedbackRequest}
          </button>
          {!hideCancel && (
            <button type="button" className="button-min btn btn-default" onClick={() => navigate('/user')}>
              {translations.cancel}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CustomerFeedback;
