import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const TeamRequest = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [deletingRequestId, setDeletingRequestId] = useState(null);

  useEffect(() => {
    const fetchTeamRequests = async () => {
      const token = localStorage.getItem('token');
      if (token && user && user.teamId) { // Use user.teamId
        try {
          // Include teamId in the request
          const response = await axios.get(`/api/team/requests/${user.teamId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRequests(response.data || []);
        } catch (error) {
          console.error('Error fetching team requests:', error);
          setRequests([]);
        }
      }
    };

    fetchTeamRequests();
  }, [user]);

  const handleEdit = (request) => {
    setEditingRequest(request);
    setCompany(request.customerCompany);
    setContactPerson(request.customerName);
    setEmail(request.customerMailaddr);
  };

  const handleSaveRequest = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/teamFeedback/${editingRequest.customerFdbckID}`, {
        customerCompany: company,
        customerName: contactPerson,
        customerMailaddr: email,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(requests.map(req =>
        req.customerFdbckID === editingRequest.customerFdbckID ? { ...req, customerCompany: company, customerName: contactPerson, customerMailaddr: email } : req
      ));
      setEditingRequest(null);
      setMessage('Team feedback request updated successfully!');
    } catch (error) {
      console.error('Error saving feedback request:', error);
    }
  };

  const handleDeleteRequest = async (requestID) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/teamFeedback/${requestID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(req => req.customerFdbckID !== requestID));
      setDeletingRequestId(null);
    } catch (error) {
      console.error('Error deleting feedback request:', error);
    }
  };

  const confirmDelete = (requestID) => {
    setDeletingRequestId(requestID);
  };

  const cancelDelete = () => {
    setDeletingRequestId(null);
  };

  const handleRemind = (request) => {
    const sendDate = new Date(request.customerFdbckSend).toLocaleDateString();
    const mailtoLink = `mailto:${request.customerMailaddr}?subject=Reminder%20for%20Feedback%20sent%20on%20${sendDate}&body=Dear%20${request.customerName},%0A%0A${request.customerFdbckUrl}%0A%0ABest%20regards,%0A${user.firstName}%20${user.lastName}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="mb-5">
      <h3>Team Feedback Requests</h3>
      {message && <p>{message}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Sent On</th>
            <th>Customer Company</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Feedback URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(requests) && requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.customerFdbckID}>
                <td>{new Date(request.customerFdbckSend).toLocaleDateString()}</td>
                <td>{request.customerCompany}</td>
                <td>{request.customerName}</td>
                <td>{request.customerMailaddr}</td>
                <td>
                  <a href={request.customerFdbckUrl} download className="btn btn-link">
                    Open Feedback
                  </a>
                </td>
                <td>
                  {deletingRequestId === request.customerFdbckID ? (
                    <>
                      <button className="btn btn-danger mr-2" onClick={() => handleDeleteRequest(request.customerFdbckID)}>
                        Confirm Delete?
                      </button>
                      <button className="btn btn-secondary" onClick={cancelDelete}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary mr-2" onClick={() => handleEdit(request)}>Edit</button>
                      <button className="btn btn-danger mr-2" onClick={() => confirmDelete(request.customerFdbckID)}>
                        Delete
                      </button>
                      <button className="btn btn-warning" onClick={() => handleRemind(request)}>Remind</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No feedback requests found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingRequest && (
        <div className="mt-5">
          <h3>Edit Feedback Request</h3>
          <div className="form-group">
            <label>Customer Company</label>
            <input
              type="text"
              className="form-control"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Contact Person</label>
            <input
              type="text"
              className="form-control"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSaveRequest}>Save</button>
          <button className="btn btn-secondary ml-2" onClick={() => setEditingRequest(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TeamRequest;
