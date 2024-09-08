import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { translate } from './translateFunction'; // Import the translate function

const AdminTeam = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]); 
  const [editingTeam, setEditingTeam] = useState(null);
  const [deletingTeamId, setDeletingTeamId] = useState(null); 

  // State for translations
  const [translations, setTranslations] = useState({
    teamManagement: '',
    teamNameLabel: '',
    teamLeaderLabel: '',
    actionsLabel: '',
    editButton: '',
    deleteButton: '',
    confirmDeleteButton: '',
    cancelButton: '',
    saveButton: '',
    cancelEditButton: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const teamManagement = await translate(120); // "Teamverwaltung"
      const teamNameLabel = await translate(121); // "Teamname"
      const teamLeaderLabel = await translate(122); // "Teamleiter"
      const actionsLabel = await translate(123); // "Aktionen"
      const editButton = await translate(124); // "Bearbeiten"
      const deleteButton = await translate(125); // "Löschen"
      const confirmDeleteButton = await translate(126); // "Wirklich löschen?"
      const cancelButton = await translate(127); // "Abbrechen"
      const saveButton = await translate(128); // "Speichern"
      const cancelEditButton = await translate(129); // "Abbrechen"

      setTranslations({
        teamManagement,
        teamNameLabel,
        teamLeaderLabel,
        actionsLabel,
        editButton,
        deleteButton,
        confirmDeleteButton,
        cancelButton,
        saveButton,
        cancelEditButton
      });
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await axios.get('/api/admin/teams');
      setTeams(response.data);
    };

    const fetchUsers = async () => {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data); 
    };

    fetchTeams();
    fetchUsers(); 
  }, []);

  const getUserFullName = (userId) => {
    const user = users.find(user => user.usersID === userId);
    return user ? `${user.usersVorname} ${user.usersNachname}` : 'Unbekannt';
  };

  const confirmDelete = (teamId) => {
    setDeletingTeamId(teamId); 
  };

  const cancelDelete = () => {
    setDeletingTeamId(null); 
  };

  const handleDeleteTeam = async (teamId) => {
    await axios.delete(`/api/admin/teams/${teamId}`);
    setTeams(teams.filter((team) => team.teamID !== teamId));
    setDeletingTeamId(null); 
  };

  const handleSaveTeam = async () => {
    const { teamID, teamName, teamLeaderFK } = editingTeam;
    await axios.put(`/api/admin/teams/${teamID}`, {
      teamName,
      teamLeaderFK
    });

    const fetchTeams = async () => {
      const response = await axios.get('/api/admin/teams');
      setTeams(response.data);
    };

    const fetchUsers = async () => {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    };

    await fetchTeams();
    await fetchUsers();

    setEditingTeam(null); 
  };

  return (
    <div className="mb-5">
      <h3>{translations.teamManagement}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>{translations.teamNameLabel}</th>
            <th>{translations.teamLeaderLabel}</th>
            <th>{translations.actionsLabel}</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.teamID}>
              <td>{team.teamName}</td>
              <td>{getUserFullName(team.teamLeaderFK)}</td> 
              <td>
                <button className="btn btn-primary" onClick={() => setEditingTeam(team)}>{translations.editButton}</button>
                {deletingTeamId === team.teamID ? (
                  <>
                    <button className="btn btn-danger mr-2" onClick={() => handleDeleteTeam(team.teamID)}>{translations.confirmDeleteButton}</button>
                    <button className="btn btn-secondary" onClick={cancelDelete}>{translations.cancelButton}</button>
                  </>
                ) : (
                  <button className="btn btn-danger" onClick={() => confirmDelete(team.teamID)}>{translations.deleteButton}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTeam && (
        <div className="mb-5">
          <h3>{translations.teamNameLabel}</h3>
          <form onSubmit={handleSaveTeam}>
            <div className="form-group">
              <label>{translations.teamNameLabel}</label>
              <input
                type="text"
                className="form-control"
                value={editingTeam.teamName}
                onChange={(e) => setEditingTeam({ ...editingTeam, teamName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{translations.teamLeaderLabel}</label>
              <select
                className="form-control"
                value={editingTeam.teamLeaderFK}
                onChange={(e) => setEditingTeam({ ...editingTeam, teamLeaderFK: e.target.value })}
              >
                {users.map(user => (
                  <option key={user.usersID} value={user.usersID}>
                    {user.usersVorname} {user.usersNachname}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleSaveTeam}>{translations.saveButton}</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditingTeam(null)}>{translations.cancelEditButton}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
