import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios'; 
import { AuthContext } from './AuthContext'; 

const TeamSelector = ({ onFilterChange }) => { 
  const { user } = useContext(AuthContext); // Zugriff auf den aktuellen Benutzer
  const [teams, setTeams] = useState([]); // Liste der Teams
  const [selectedTeam, setSelectedTeam] = useState(user.teamId || 'all'); // Ausgewähltes Team
  const [users, setUsers] = useState([]); // Liste der Benutzer
  const [selectedUser, setSelectedUser] = useState('all'); // Ausgewählter Benutzer

  // Effekt zum Abrufen der Teams basierend auf der Benutzerrolle
  useEffect(() => { 
    const fetchTeams = async () => {
      const token = localStorage.getItem('token'); // Token aus dem localStorage
      try {
        const response = await axios.get('/api/teams', {
          headers: { Authorization: `Bearer ${token}` } // Autorisierung für die Abfrage
        });
        if (user.role === 2) { 
          const userTeam = response.data.filter((team) => team.teamID === user.teamId); // Nur Team des Teamleiters
          setTeams(userTeam);
        } else if (user.role === 3) { 
          setTeams([{ teamID: 'all', teamName: 'Alle Teams' }, ...response.data]); // Admin: Alle Teams
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Teams:', error);
      }
    };

    fetchTeams(); // Teams abrufen
  }, [user]);

  // Effekt zum Abrufen der Benutzer basierend auf dem ausgewählten Team
  useEffect(() => { 
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (selectedTeam !== 'all') {
        try {
          const response = await axios.get(`/api/users/team/${selectedTeam}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers([{ usersID: 'all', fullName: 'Alle Benutzer' }, ...response.data]); // Liste der Benutzer
        } catch (error) {
          console.error('Fehler beim Abrufen der Benutzer:', error);
        }
      } else {
        setUsers([{ usersID: 'all', fullName: 'Alle Benutzer' }]); // Alle Benutzer
      }
    };

    fetchUsers(); // Benutzer abrufen, wenn Team geändert wird
  }, [selectedTeam]);

  // Handler, wenn das Team geändert wird
  const handleTeamChange = (event) => {
    const selectedTeamValue = event.target.value; 
    setSelectedTeam(selectedTeamValue); // Team setzen
    setSelectedUser('all'); // Benutzer zurücksetzen
    onFilterChange(selectedTeamValue, 'all'); // Filter-Callback auslösen
  };

  // Handler, wenn der Benutzer geändert wird
  const handleUserChange = (event) => {
    const selectedUserValue = event.target.value;
    setSelectedUser(selectedUserValue); // Benutzer setzen
    onFilterChange(selectedTeam, selectedUserValue); // Filter-Callback auslösen
  };

  return (
    <div className="team-selector mb-3"> 
      <label htmlFor="teamSelect">Team auswählen:</label>
      <select
        id="teamSelect"
        className="form-control"
        value={selectedTeam}
        onChange={handleTeamChange}
        disabled={user.role === 2} // Disable the dropdown if the user role is 2
      >
        {teams.map((team) => (
          <option key={team.teamID} value={team.teamID}> 
            {team.teamName}
          </option>
        ))}
      </select>

      <label htmlFor="userSelect" className="mt-3">Benutzer auswählen:</label>
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
