import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import TeamFeedback from './TeamFeedback';
import TeamRequest from './TeamRequest';
import TeamReceived from './TeamReceived';
import TeamSelector from './TeamSelector';
import Profile from './Profile';
import TeamProfile from './TeamProfile';
import { translate } from './translateFunction'; // Import the translate function

const Team = () => {
  const { user } = useContext(AuthContext);
  // eslint-disable-next-line
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState(user.role === 3 ? 'all' : user.teamId);
  const [selectedUser, setSelectedUser] = useState('all');

  // State for translations
  const [translations, setTranslations] = useState({
    teamFeedbackTitle: '',
    teamFeedbackSubtitle: '',
    veryPositive: '',
    positive: '',
    neutral: '',
    negative: '',
    veryNegative: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const teamFeedbackTitle = await translate(10); // "Team Feedbacks"
      const teamFeedbackSubtitle = await translate(11); // "Überblick über erhaltene, offene und selbst erstellte Feedbacks des gesamten Teams"
      const veryPositive = await translate(12); // "Sehr Positiv"
      const positive = await translate(13); // "Positiv"
      const neutral = await translate(14); // "Neutral"
      const negative = await translate(15); // "Negativ"
      const veryNegative = await translate(16); // "Sehr Negativ"

      setTranslations({
        teamFeedbackTitle,
        teamFeedbackSubtitle,
        veryPositive,
        positive,
        neutral,
        negative,
        veryNegative
      });
    };

    loadTranslations();
  }, []);

  // Handle team and user filter changes
  const handleFilterChange = (teamId, userId) => {
    setSelectedTeam(teamId);
    setSelectedUser(userId);
  };

  return (
    <div className="container-fluid mt-5">
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/Chain.png" alt="Team icon" />
          </div>
          <hgroup className="title">
            <h1>{translations.teamFeedbackTitle}</h1>
            <p>{translations.teamFeedbackSubtitle}</p>
          </hgroup>
          <div className="feedback-legend">
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/VeryPositive.png" alt={translations.veryPositive} />
              <span>{translations.veryPositive}</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/Positive.png" alt={translations.positive} />
              <span>{translations.positive}</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/Unknown.png" alt={translations.neutral} />
              <span>{translations.neutral}</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/Negative.png" alt={translations.negative} />
              <span>{translations.negative}</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/VeryNegative.png" alt={translations.veryNegative} />
              <span>{translations.veryNegative}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-5">
        {/* Team and user selection */}
        <TeamSelector onFilterChange={handleFilterChange} />

        {/* Show TeamProfile if no user and a specific team is selected */}
        {selectedUser === 'all' && selectedTeam !== 'all' && <TeamProfile selectedTeamId={selectedTeam} />}

        {/* Show Profile if a specific user is selected */}
        {selectedUser !== 'all' && <Profile selectedUserId={selectedUser} />}

        {/* Table for received team feedback */}
        <TeamReceived selectedTeam={selectedTeam} selectedUser={selectedUser} />

        {/* Table for feedback created by the team */}
        <TeamFeedback selectedTeam={selectedTeam} selectedUser={selectedUser} />

        {/* Table for feedback requests */}
        <TeamRequest selectedTeam={selectedTeam} selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Team;
