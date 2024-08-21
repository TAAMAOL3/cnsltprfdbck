import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Assuming you're using AuthContext for the logged-in user
import LinkGenerator from './linkGenerator'; // Use the LinkGenerator for generating the link
import { animateButton } from './buttonAnimations'; // Import the button animation function
import './buttonAnimations.scss'; // Import the SCSS for the animations

const CustomerFeedback = () => {
  const { user } = useContext(AuthContext); // Assuming you're using AuthContext to get the logged-in user
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle form submission
  const [hideCancel, setHideCancel] = useState(false); // State to hide the "Abbrechen" button
  const navigate = useNavigate();

  // Function to generate the feedback URL
  const handleGenerateLink = () => {
    const randomString = LinkGenerator.randomString(10); // Generate random string for the link
    const host = process.env.REACT_APP_URL_HOST; // Assuming REACT_APP_URL_HOST is defined in the environment variables
    const link = `${host}/feedback?id=${randomString}`;
    return { link, randomString };
  };

  // Function to handle form submission and insert the feedback into the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]'); // Get the submit button

    setIsSubmitting(true); // Disable the button while submitting
    setHideCancel(true); // Hide the "Abbrechen" button

    const { link, randomString } = handleGenerateLink(); // Generate the link and get the randomString

    const token = localStorage.getItem('token');
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    try {
      const response = await axios.post('/api/customerFeedback', {
        customerCompany: company,
        customerName: contactPerson,
        customerMailaddr: email,
        customerFdbckSend: currentDate,
        customerFdbckText: null, // Set to NULL as per your requirement
        customerFdbckReceived: null, // Set to NULL
        customerFdbckUrl: link, // Store the full generated feedback URL
        customerFdbckUrlID: randomString, // Store only the randomString in customerFdbckUrlID
        customerFdbckAnswered: 0, // Default to 0 (false)
        usersFK: user.id, // Assuming the user's ID is stored in the AuthContext
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        // Trigger the success animation only for the submit button
        animateButton(submitButton, 'success');

        // Redirect to /user after 3 seconds
        setTimeout(() => {
          navigate('/user');
        }, 3000);
      }
    } catch (error) {
      console.error('Ein Fehler ist aufgetreten:', error);

      // Trigger the error animation only for the submit button
      animateButton(submitButton, 'error');
    } finally {
      setIsSubmitting(false); // Re-enable the button after the submission
    }
  };

  return (
    <div className="container-fluid mt-5">
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/person_BOLD.svg" alt="Person icon" />
          </div>
          <hgroup className="title">
            <h1>Feedback Anfrage generieren</h1>
          </hgroup>
        </div>
      </section>

      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kunden Firma</label>
            <input
              type="text"
              className="form-control"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Firma des Kunden"
              required
            />
          </div>
          <div className="form-group">
            <label>Ansprechperson</label>
            <input
              type="text"
              className="form-control"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Ansprechperson"
              required
            />
          </div>
          <div className="form-group">
            <label>E-Mail</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Mail-Adresse"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary button" // Original styling with animation class
            disabled={isSubmitting} // Disable the button while submitting
          >
            {isSubmitting ? 'Absenden...' : 'Feedback Anfrage generieren'}
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

export default CustomerFeedback;
