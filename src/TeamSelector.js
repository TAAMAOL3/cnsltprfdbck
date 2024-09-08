import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { translate } from './translateFunction'; // Import the translate function

const TeamSelector = ({ onFilterChange }) => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(user.role === 3 ? 'all' : user.teamId);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');

  // State for translations
  const [translations, setTranslations] = useState({
    selectTeamLabel: '',
    selectUserLabel: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const selectTeamLabel = await translate(408); // "Alle Teams"
      const selectUserLabel = await translate(409); // "Alle Benutzer"

      setTranslations({
        selectTeamLabel,
        selectUserLabel
      });
    };

    loadTranslations();
  }, []);

  // Fetch teams based on the user role
  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/teams', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (user.role === 2) {
          const userTeam = response.data.filter((team) => team.teamID === user.teamId);
          setTeams(userTeam);
        } else if (user.role === 3) {
          setTeams([{ teamID: 'all', teamName: translations.selectTeamLabel }, ...response.data]);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Teams:', error);
      }
    };

    fetchTeams();
  }, [user, translations]);

  // Fetch users based on the selected team
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (selectedTeam !== 'all') {
        try {
          const response = await axios.get(`/api/users/team/${selectedTeam}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers([{ usersID: 'all', fullName: translations.selectUserLabel }, ...response.data]);
        } catch (error) {
          console.error('Fehler beim Abrufen der Benutzer:', error);
        }
      } else {
        setUsers([{ usersID: 'all', fullName: translations.selectUserLabel }]);
      }
    };

    fetchUsers();
  }, [selectedTeam, translations]);

  // Handle team change
  const handleTeamChange = (event) => {
    const selectedTeamValue = event.target.value;
    setSelectedTeam(selectedTeamValue);
    setSelectedUser('all');
    onFilterChange(selectedTeamValue, 'all');
  };

  // Handle user change
  const handleUserChange = (event) => {
    const selectedUserValue = event.target.value;
    setSelectedUser(selectedUserValue);
    onFilterChange(selectedTeam, selectedUserValue);
  };

  return (
    <div className="team-selector mb-3">
      <label htmlFor="teamSelect">{translations.selectTeamLabel}:</label>
      <select
        id="teamSelect"
        className="form-control"
        value={selectedTeam}
        onChange={handleTeamChange}
        disabled={user.role === 2}
      >
        {teams.map((team) => (
          <option key={team.teamID} value={team.teamID}>
            {team.teamName}
          </option>
        ))}
      </select>

      <label htmlFor="userSelect" className="mt-3">{translations.selectUserLabel}:</label>
      <select
        id="userSelect"
        className="form-control"
        value={selectedUser}
        onChange={handleUserChange}
        disabled={selectedTeam === 'all'}
      >
        {users.map((user) => (
          <option key={user.usersID} value={user.usersID}>
            {user.fullName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeamSelector;
