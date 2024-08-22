import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const TeamReceived = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [viewingFeedback, setViewingFeedback] = useState(null);

  useEffect(() => {
    const fetchTeamFeedbacks = async () => {
      const token = localStorage.getItem('token');
      if (token && user && user.teamId) { // Use user.teamId
        try {
          // Include teamId in the request
          const response = await axios.get(`/api/team/received/${user.teamId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFeedbacks(response.data || []);
        } catch (error) {
          console.error('Error fetching team feedbacks:', error);
          setFeedbacks([]);
        }
      }
    };

    fetchTeamFeedbacks();
  }, [user]);

  const handleViewFeedback = (feedback) => {
    setViewingFeedback(feedback);
  };

  const getRatingIcon = (rating) => {
    if (rating >= 2) {
      return <img className="page-icon" src="/Content/themes/base/images/VeryPositive.png" alt="Very Positive" />;
    } else if (rating === 1) {
      return <img className="page-icon" src="/Content/themes/base/images/Positive.png" alt="Positive" />;
    } else if (rating === 0) {
      return <img className="page-icon" src="/Content/themes/base/images/Unknown.png" alt="Unknown" />;
    } else if (rating === -1) {
      return <img className="page-icon" src="/Content/themes/base/images/Negative.png" alt="Negative" />;
    } else if (rating <= -2) {
      return <img className="page-icon" src="/Content/themes/base/images/VeryNegative.png" alt="Very Negative" />;
    }
  };

  return (
    <div className="mb-5">
      <h3>Team Received Feedback</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Received On</th>
            <th>Customer Company</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <tr key={feedback.customerFdbckID}>
                <td>{new Date(feedback.customerFdbckReceived).toLocaleDateString()}</td>
                <td>{feedback.customerCompany}</td>
                <td>{feedback.customerName}</td>
                <td>{feedback.customerMailaddr}</td>
                <td>{getRatingIcon(feedback.rating)}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleViewFeedback(feedback)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No feedback found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {viewingFeedback && (
        <div className="mt-5">
          <h3>View Feedback</h3>
          <p style={{ fontSize: '1.5rem' }}><strong>Feedback:</strong> {viewingFeedback.customerFdbckText}</p>
          <button className="btn btn-secondary" onClick={() => setViewingFeedback(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default TeamReceived;
