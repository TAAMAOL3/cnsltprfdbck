import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // Zustand für Rollenliste
  const [teams, setTeams] = useState([]); // Zustand für Teams
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null); // Neuer Zustand für die Bestätigung

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    };

    const fetchRoles = async () => {
      const response = await axios.get('/api/admin/roles');
      setRoles(response.data); // Lade Rollenliste
    };

    const fetchTeams = async () => {
      const response = await axios.get('/api/admin/teams'); // Teams abrufen
      setTeams(response.data);
    };

    fetchUsers();
    fetchRoles(); // Lade Rollenliste beim Mounten der Komponente
    fetchTeams(); // Lade Teams beim Mounten der Komponente
  }, []);

  const getRoleName = (roleId) => {
    const role = roles.find(role => role.rolesID === roleId);
    return role ? role.rolesName : 'Unbekannt';
  };

  const getTeamName = (teamId) => {
    const team = teams.find(team => team.teamID === teamId);
    return team ? team.teamName : 'Kein Team';
  };

  const confirmDelete = (userId) => {
    setDeletingUserId(userId); // Setzt das zu löschende User ID
  };

  const cancelDelete = () => {
    setDeletingUserId(null); // Löschen abbrechen
  };

  const handleDeleteUser = async (userId) => {
    await axios.delete(`/api/admin/users/${userId}`);
    setUsers(users.filter((user) => user.usersID !== userId));
    setDeletingUserId(null); // Reset delete confirmation state
  };

  const handleSaveUser = async () => {
    const { usersID, usersEmail, usersVorname, usersNachname, rolesFK, teamFK } = editingUser;
    try {
      await axios.put(`/api/admin/users/${usersID}`, {
        usersEmail,
        usersVorname,
        usersNachname,
        rolesFK,
        teamFK
      });

      // Finde den Namen des Teams, um ihn in der Anzeige zu aktualisieren
      const updatedTeamName = getTeamName(teamFK);

      setUsers(users.map((user) =>
        user.usersID === usersID
          ? { ...user, usersEmail, usersVorname, usersNachname, rolesFK, teamFK, teamName: updatedTeamName } // Aktualisiere teamFK und teamName
          : user
      ));

      setEditingUser(null); // Bearbeitungsformular schließen
    } catch (error) {
      console.error('Fehler beim Speichern des Benutzers:', error);
    }
  };

  return (
    <div className="mb-5">
      <h3>Benutzerverwaltung</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>E-Mail</th>
            <th>Rolle</th>
            <th>Team</th> {/* Team-Spalte hinzufügen */}
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr 
              key={user.usersID}
              className={user.teamFK === 0 ? 'bg-pastel-yellow' : ''} // Bedingte Klasse für kein Team
            >
              <td>{user.usersVorname}</td>
              <td>{user.usersNachname}</td>
              <td>{user.usersEmail}</td>
              <td>{getRoleName(user.rolesFK)}</td>
              <td>{user.teamName || getTeamName(user.teamFK)}</td> {/* Teamnamen anzeigen */}
              <td>
                <button className="btn btn-primary" onClick={() => setEditingUser(user)}>Bearbeiten</button>
                {deletingUserId === user.usersID ? (
                  <>
                    <button className="btn btn-danger mr-2" onClick={() => handleDeleteUser(user.usersID)}>Wirklich löschen?</button>
                    <button className="btn btn-secondary" onClick={cancelDelete}>Abbrechen</button>
                  </>
                ) : (
                  <button className="btn btn-danger" onClick={() => confirmDelete(user.usersID)}>Löschen</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="mb-5">
          <h3>Benutzer bearbeiten</h3>
          <form onSubmit={handleSaveUser}>
            <div className="form-group">
              <label>E-Mail</label>
              <input
                type="email"
                className="form-control"
                value={editingUser.usersEmail}
                onChange={(e) => setEditingUser({ ...editingUser, usersEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Vorname</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.usersVorname}
                onChange={(e) => setEditingUser({ ...editingUser, usersVorname: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Nachname</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.usersNachname}
                onChange={(e) => setEditingUser({ ...editingUser, usersNachname: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Rolle</label>
              <select
                className="form-control"
                value={editingUser.rolesFK}
                onChange={(e) => setEditingUser({ ...editingUser, rolesFK: e.target.value })}
              >
                {roles.map(role => (
                  <option key={role.rolesID} value={role.rolesID}>
                    {role.rolesName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Team</label>
              <select
                className="form-control"
                value={editingUser.teamFK}
                onChange={(e) => setEditingUser({ ...editingUser, teamFK: e.target.value })}
              >
                {teams.map(team => (
                  <option key={team.teamID} value={team.teamID}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleSaveUser}>Speichern</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditingUser(null)}>Abbrechen</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUser;
