import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const TeamFeedback = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [received, setReceived] = useState('');
  const [message, setMessage] = useState('');
  const [deletingFeedbackId, setDeletingFeedbackId] = useState(null);

  useEffect(() => {
    const fetchTeamFeedbacks = async () => {
      const token = localStorage.getItem('token');
      if (token && user && user.teamId) {
        try {
          // Fetch feedback data based on teamId
          const response = await axios.get(`/api/team/team/${user.teamId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFeedbacks(response.data || []);
        } catch (error) {
          console.error('Error fetching team feedback:', error);
          setFeedbacks([]);
        }
      }
    };

    fetchTeamFeedbacks();
  }, [user]);

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setCustomer(feedback.variousFdbckCustomer);  // Correct field
    setDescription(feedback.variousFdbckDescription);  // Correct field
    setReceived(feedback.variousFdbckReceived);  // Correct field
  };

  const handleSaveFeedback = async () => {
    const token = localStorage.getItem('token');
    try {
      const formattedDate = received.split('/').reverse().join('-'); // Format dd/MM/yyyy to yyyy-MM-dd

      await axios.put(`/api/teamFeedback/${editingFeedback.variousFdbckID}`, {
        customerCompany: customer,
        customerFdbckText: description,
        customerFdbckReceived: formattedDate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFeedbacks(feedbacks.map(fb =>
        fb.variousFdbckID === editingFeedback.variousFdbckID ? { ...fb, variousFdbckCustomer: customer, variousFdbckDescription: description, variousFdbckReceived: formattedDate } : fb
      ));
      setEditingFeedback(null);
      setMessage('Team feedback updated successfully!');
    } catch (error) {
      console.error('Error saving feedback:', error.message || error);
    }
  };

  const handleDeleteFeedback = async (feedbackID) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/teamFeedback/${feedbackID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(feedbacks.filter(fb => fb.variousFdbckID !== feedbackID));  // Correct field
      setDeletingFeedbackId(null);
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const confirmDelete = (feedbackID) => {
    setDeletingFeedbackId(feedbackID);
  };

  const cancelDelete = () => {
    setDeletingFeedbackId(null);
  };

  return (
    <div className="mb-5">
      <h3>Team Feedback</h3>
      {message && <p>{message}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Feedback Received</th>
            <th>Customer</th>
            <th>Description</th>
            <th>File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <tr key={feedback.variousFdbckID}>  
                <td>{new Date(feedback.variousFdbckReceived).toLocaleDateString()}</td>  
                <td>{feedback.variousFdbckCustomer}</td>  
                <td>{feedback.variousFdbckDescription}</td>  
                <td>
                  <a href={feedback.uploadUrl} download className="btn btn-link">
                    Download File
                  </a>
                </td>
                <td>
                  {deletingFeedbackId === feedback.variousFdbckID ? (  
                    <>
                      <button className="btn btn-danger mr-2" onClick={() => handleDeleteFeedback(feedback.variousFdbckID)}> 
                        Confirm Delete?
                      </button>
                      <button className="btn btn-secondary" onClick={cancelDelete}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary mr-2" onClick={() => handleEdit(feedback)}>Edit</button>
                      <button className="btn btn-danger mr-2" onClick={() => confirmDelete(feedback.variousFdbckID)}> 
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No feedback found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingFeedback && (
        <div className="mt-5">
          <h3>Edit Feedback</h3>
          <div className="form-group">
            <label>Customer</label>
            <input
              type="text"
              className="form-control"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Received On</label>
            <input
              type="date"
              className="form-control"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSaveFeedback}>Save</button>
          <button className="btn btn-secondary ml-2" onClick={() => setEditingFeedback(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TeamFeedback;