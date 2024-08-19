import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTeam = () => {
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);

  // Lade alle Teams
  useEffect(() => {
    const fetchTeams = async () => {
      const response = await axios.get('/api/admin/teams');
      setTeams(response.data);
    };
    fetchTeams();
  }, []);

  // Team löschen
  const handleDeleteTeam = async (teamId) => {
    await axios.delete(`/api/admin/teams/${teamId}`);
    setTeams(teams.filter((team) => team.teamID !== teamId));
  };

  // Team speichern
  const handleSaveTeam = async () => {
    const { teamID, teamName, teamLeaderFK } = editingTeam;
    await axios.put(`/api/admin/teams/${teamID}`, {
      teamName,
      teamLeaderFK
    });
    setTeams(teams.map((team) =>
      team.teamID === teamID ? editingTeam : team
    ));
    setEditingTeam(null); // Bearbeitungsformular schließen
  };

  return (
    <div className="mb-5">
      <h3>Teamverwaltung</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Teamname</th>
            <th>Teamleiter</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.teamID}>
              <td>{team.teamID}</td>
              <td>{team.teamName}</td>
              <td>{team.teamLeaderFK}</td>
              <td>
                <button onClick={() => setEditingTeam(team)}>Bearbeiten</button>
                <button onClick={() => handleDeleteTeam(team.teamID)}>Löschen</button>
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
              <label>Teamleiter (teamLeaderFK)</label>
              <input
                type="number"
                className="form-control"
                value={editingTeam.teamLeaderFK}
                onChange={(e) => setEditingTeam({ ...editingTeam, teamLeaderFK: e.target.value })}
              />
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
