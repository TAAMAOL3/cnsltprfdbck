import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTeam = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]); // Neuer Zustand für Benutzer
  const [editingTeam, setEditingTeam] = useState(null);
  const [deletingTeamId, setDeletingTeamId] = useState(null); // Neuer Zustand für die Bestätigung

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await axios.get('/api/admin/teams');
      setTeams(response.data);
    };

    const fetchUsers = async () => {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data); // Lade Benutzerliste
    };

    fetchTeams();
    fetchUsers(); // Lade die Benutzerliste beim Mounten der Komponente
  }, []);

  const getUserFullName = (userId) => {
    const user = users.find(user => user.usersID === userId);
    return user ? `${user.usersVorname} ${user.usersNachname}` : 'Unbekannt';
  };

  const confirmDelete = (teamId) => {
    setDeletingTeamId(teamId); // Setzt das zu löschende Team ID
  };

  const cancelDelete = () => {
    setDeletingTeamId(null); // Löschen abbrechen
  };

  const handleDeleteTeam = async (teamId) => {
    await axios.delete(`/api/admin/teams/${teamId}`);
    setTeams(teams.filter((team) => team.teamID !== teamId));
    setDeletingTeamId(null); // Reset delete confirmation state
  };

  const handleSaveTeam = async () => {
    const { teamID, teamName, teamLeaderFK } = editingTeam;
    await axios.put(`/api/admin/teams/${teamID}`, {
      teamName,
      teamLeaderFK
    });

    // Teams und Benutzer erneut abrufen, um die aktuelle Anzeige zu aktualisieren
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

    setEditingTeam(null); // Bearbeitungsformular schließen
  };

  return (
    <div className="mb-5">
      <h3>Teamverwaltung</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Teamname</th>
            <th>Teamleiter</th>
            <th>Aktionen</th> {/* Team ID wurde entfernt */}
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.teamID}>
              <td>{team.teamName}</td>
              <td>{getUserFullName(team.teamLeaderFK)}</td> {/* Zeigt Vor- und Nachname an */}
              <td>
                <button className="btn btn-primary" onClick={() => setEditingTeam(team)}>Bearbeiten</button> {/* Blaues Styling hinzugefügt */}
                {deletingTeamId === team.teamID ? (
                  <>
                    <button className="btn btn-danger mr-2" onClick={() => handleDeleteTeam(team.teamID)}>Wirklich löschen?</button>
                    <button className="btn btn-secondary" onClick={cancelDelete}>Abbrechen</button>
                  </>
                ) : (
                  <button className="btn btn-danger" onClick={() => confirmDelete(team.teamID)}>Löschen</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTeam && (
        <div className="mb-5">
          <h3>Team bearbeiten</h3>
          <form onSubmit={handleSaveTeam}>
            <div className="form-group">
              <label>Teamname</label>
              <input
                type="text"
                className="form-control"
                value={editingTeam.teamName}
                onChange={(e) => setEditingTeam({ ...editingTeam, teamName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Teamleiter</label>
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
            <button type="button" className="btn btn-primary" onClick={handleSaveTeam}>Speichern</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditingTeam(null)}>Abbrechen</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
