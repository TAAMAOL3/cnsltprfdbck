import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import TeamFeedback from './TeamFeedback';
import TeamRequest from './TeamRequest';
import TeamReceived from './TeamReceived'; // Import the TeamReceived component

const Team = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 2) {
      navigate('/login'); // Redirect non-team leaders to the login page
    }
  }, [user, navigate]);

  return (
    <div className="container-fluid mt-5">
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/team_BOLD.svg" alt="Team icon" />
          </div>
          <hgroup className="title">
            <h1>Team Leader Dashboard</h1>
          </hgroup>
        </div>
      </section>
      <div className="container mt-5">
        {/* Team Received Feedbacks */}
        <TeamReceived /> 

        {/* Team Feedbacks */}
        <TeamFeedback />

        {/* Team Feedback Requests */}
        <TeamRequest />
      </div>
    </div>
  );
};

export default Team;
