import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRole = () => {
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingRoleId, setDeletingRoleId] = useState(null); // Neuer Zustand für die Bestätigung

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await axios.get('/api/admin/roles');
      setRoles(response.data);
    };
    fetchRoles();
  }, []);

  const confirmDelete = (roleId) => {
    setDeletingRoleId(roleId); // Setzt das zu löschende Role ID
  };

  const cancelDelete = () => {
    setDeletingRoleId(null); // Löschen abbrechen
  };

  const handleDeleteRole = async (roleId) => {
    await axios.delete(`/api/admin/roles/${roleId}`);
    setRoles(roles.filter((role) => role.rolesID !== roleId));
    setDeletingRoleId(null); // Reset delete confirmation state
  };

  const handleSaveRole = async () => {
    const { rolesID, rolesName } = editingRole;
    await axios.put(`/api/admin/roles/${rolesID}`, {
      rolesName
    });
    setRoles(roles.map((role) =>
      role.rolesID === rolesID ? editingRole : role
    ));
    setEditingRole(null); // Bearbeitungsformular schließen
  };

  return (
    <div className="mb-5">
      <h3>Rollenverwaltung</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Rollenname</th>
            <th>Aktionen</th> {/* ID wurde entfernt */}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.rolesID}>
              <td>{role.rolesName}</td>
              <td>
                <button className="btn btn-primary" onClick={() => setEditingRole(role)}>Bearbeiten</button> {/* Blaues Styling hinzugefügt */}
                {deletingRoleId === role.rolesID ? (
                  <>
                    <button className="btn btn-danger mr-2" onClick={() => handleDeleteRole(role.rolesID)}>Wirklich löschen?</button>
                    <button className="btn btn-secondary" onClick={cancelDelete}>Abbrechen</button>
                  </>
                ) : (
                  <button className="btn btn-danger" onClick={() => confirmDelete(role.rolesID)}>Löschen</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingRole && (
        <div className="mb-5">
          <h3>Rolle bearbeiten</h3>
          <form onSubmit={handleSaveRole}>
            <div className="form-group">
              <label>Rollenname</label>
              <input
                type="text"
                className="form-control"
                value={editingRole.rolesName}
                onChange={(e) => setEditingRole({ ...editingRole, rolesName: e.target.value })}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleSaveRole}>Speichern</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditingRole(null)}>Abbrechen</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminRole;
