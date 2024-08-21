import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // Zustand für Rollenliste
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

    fetchUsers();
    fetchRoles(); // Lade Rollenliste beim Mounten der Komponente
  }, []);

  const getRoleName = (roleId) => {
    const role = roles.find(role => role.rolesID === roleId);
    return role ? role.rolesName : 'Unbekannt';
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
    const { usersID, usersEmail, usersVorname, usersNachname, rolesFK } = editingUser;
    await axios.put(`/api/admin/users/${usersID}`, {
      usersEmail,
      usersVorname,
      usersNachname,
      rolesFK
    });
    setUsers(users.map((user) =>
      user.usersID === usersID ? editingUser : user
    ));
    setEditingUser(null); // Bearbeitungsformular schließen
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
            <th>Aktionen</th> {/* User ID wurde entfernt */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.usersID}>
              <td>{user.usersVorname}</td>
              <td>{user.usersNachname}</td>
              <td>{user.usersEmail}</td>
              <td>{getRoleName(user.rolesFK)}</td> {/* Rollenauswahl nach Namen */}
              <td>
                <button className="btn btn-primary" onClick={() => setEditingUser(user)}>Bearbeiten</button> {/* Blaues Styling hinzugefügt */}
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
            <button type="button" className="btn btn-primary" onClick={handleSaveUser}>Speichern</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditingUser(null)}>Abbrechen</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUser;
