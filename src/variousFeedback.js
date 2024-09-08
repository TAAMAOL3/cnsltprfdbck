import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { translate } from './translateFunction'; // Import the translate function

const VariousFeedback = () => {
  const { user } = useContext(AuthContext);
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [received, setReceived] = useState(new Date());
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // State for translations
  const [translations, setTranslations] = useState({
    captureFeedbackTitle: '',
    uploadInstructions: '',
    customerLabel: '',
    descriptionLabel: '',
    receivedOnLabel: '',
    uploadFileLabel: '',
    submitButton: '',
    cancelButton: '',
    submittingText: '',
    successMessage: ''
  });

  // Load translations when the component mounts
  React.useEffect(() => {
    const loadTranslations = async () => {
      const captureFeedbackTitle = await translate(80); // "Feedback Erfassen"
      const uploadInstructions = await translate(81); // "Lade hier Dateien mit Feedbacks hoch, die du ausserhalb des Tools erhalten hast."
      const customerLabel = await translate(82); // "Kunde"
      const descriptionLabel = await translate(83); // "Beschreibung"
      const receivedOnLabel = await translate(84); // "Erhalten am"
      const uploadFileLabel = await translate(85); // "Datei hochladen (Bilder, PDFs, E-Mails)"
      const submitButton = await translate(86); // "Feedback hinzufügen"
      const cancelButton = await translate(87); // "Abbrechen"
      const submittingText = await translate(88); // "Absenden..."
      const successMessage = await translate(89); // "Feedback erfolgreich erfasst."

      setTranslations({
        captureFeedbackTitle,
        uploadInstructions,
        customerLabel,
        descriptionLabel,
        receivedOnLabel,
        uploadFileLabel,
        submitButton,
        cancelButton,
        submittingText,
        successMessage
      });
    };

    loadTranslations();
  }, []);

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
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('variousFdbckCustomer', customer);
    formData.append('variousFdbckDescription', description);
    formData.append('variousFdbckReceived', formatDateForInput(received));
    formData.append('uploadUrl', file);

    const token = localStorage.getItem('token');

    try {
      await axios.post('/api/feedback', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmitted(true);

      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Ein Fehler ist aufgetreten:', error.response?.data || error.message);
      alert(error.response?.data || 'Fehler beim Hochladen der Datei. Erlaubte Formate: PNG, JPEG, PDF.');
      setIsSubmitting(false);
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
            <h1>{translations.captureFeedbackTitle}</h1>
            <p>{translations.uploadInstructions}</p>
          </hgroup>
        </div>
      </section>
      <div className="container mt-5">
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{translations.customerLabel}</label>
              <input
                type="text"
                className="form-control"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder={translations.customerLabel}
                required
              />
            </div>
            <div className="form-group">
              <label>{translations.descriptionLabel}</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={translations.descriptionLabel}
                required
              />
            </div>
            <div className="form-group">
              <label>{translations.receivedOnLabel}</label>
              <DatePicker
                selected={received}
                onChange={(date) => setReceived(date)}
                dateFormat="dd.MM.yyyy"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>{translations.uploadFileLabel}</label>
              <input type="file" className="form-control" onChange={handleFileChange} />
            </div>
            <button
              type="submit"
              className="btn btn-primary button"
              disabled={isSubmitting}
            >
              {isSubmitting ? translations.submittingText : translations.submitButton}
            </button>
            {!isSubmitting && (
              <button type="button" className="btn btn-secondary ml-3" onClick={() => navigate('/user')}>
                {translations.cancelButton}
              </button>
            )}
          </form>
        ) : (
          <div className="feedback-success-message" style={{ textAlign: 'center' }}>
            <div className="checkmark">&#10003;</div>
            <h3>{translations.successMessage}<br />Du wirst in Kürze weitergeleitet.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariousFeedback;
