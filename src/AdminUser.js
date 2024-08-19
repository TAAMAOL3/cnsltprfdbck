import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // Lade alle Benutzer
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  // Benutzer löschen
  const handleDeleteUser = async (userId) => {
    await axios.delete(`/api/admin/users/${userId}`);
    setUsers(users.filter((user) => user.usersID !== userId));
  };

  // Benutzer speichern
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
            <th>ID</th>
            <th>Email</th>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.usersID}>
              <td>{user.usersID}</td>
              <td>{user.usersEmail}</td>
              <td>{user.usersVorname}</td>
              <td>{user.usersNachname}</td>
              <td>
                <button onClick={() => setEditingUser(user)}>Bearbeiten</button>
                <button onClick={() => handleDeleteUser(user.usersID)}>Löschen</button>
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
              <label>Email</label>
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
              <label>Rolle (rolesFK)</label>
              <input
                type="number"
                className="form-control"
                value={editingUser.rolesFK}
                onChange={(e) => setEditingUser({ ...editingUser, rolesFK: e.target.value })}
              />
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
