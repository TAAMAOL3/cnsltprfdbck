import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { translate } from './translateFunction'; // Import the translate function

const AdminRole = () => {
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingRoleId, setDeletingRoleId] = useState(null); // New state for delete confirmation

  // State for translations
  const [translations, setTranslations] = useState({
    roleManagement: '',
    roleNameLabel: '',
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
      const roleManagement = await translate(110); // "Rollenverwaltung"
      const roleNameLabel = await translate(111); // "Rollenname"
      const actionsLabel = await translate(112); // "Aktionen"
      const editButton = await translate(113); // "Bearbeiten"
      const deleteButton = await translate(114); // "Löschen"
      const confirmDeleteButton = await translate(115); // "Wirklich löschen?"
      const cancelButton = await translate(116); // "Abbrechen"
      const saveButton = await translate(117); // "Speichern"
      const cancelEditButton = await translate(118); // "Abbrechen"

      setTranslations({
        roleManagement,
        roleNameLabel,
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
    const fetchRoles = async () => {
      const response = await axios.get('/api/admin/roles');
      setRoles(response.data);
    };
    fetchRoles();
  }, []);

  const confirmDelete = (roleId) => {
    setDeletingRoleId(roleId); // Set role ID to delete
  };

  const cancelDelete = () => {
    setDeletingRoleId(null); // Cancel delete
  };

  const handleDeleteRole = async (roleId) => {
    await axios.delete(`/api/admin/roles/${roleId}`);
    setRoles(roles.filter((role) => role.rolesID !== roleId));
    setDeletingRoleId(null); // Reset delete confirmation state
  };

  const handleSaveRole = async () => {
    const { rolesID, rolesName } = editingRole;
    await axios.put(`/api/admin/roles/${rolesID}`, { rolesName });
    setRoles(roles.map((role) => (role.rolesID === rolesID ? editingRole : role)));
    setEditingRole(null); // Close edit form
  };

  return (
    <div className="mb-5">
      <h3>{translations.roleManagement}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>{translations.roleNameLabel}</th>
            <th>{translations.actionsLabel}</th> {/* ID removed */}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.rolesID}>
              <td>{role.rolesName}</td>
              <td>
                <button className="btn btn-primary" onClick={() => setEditingRole(role)}>{translations.editButton}</button>
                {deletingRoleId === role.rolesID ? (
                  <>
                    <button className="btn btn-danger mr-2" onClick={() => handleDeleteRole(role.rolesID)}>{translations.confirmDeleteButton}</button>
                    <button className="btn btn-secondary" onClick={cancelDelete}>{translations.cancelButton}</button>
                  </>
                ) : (
                  <button className="btn btn-danger" onClick={() => confirmDelete(role.rolesID)}>{translations.deleteButton}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingRole && (
        <div className="mb-5">
          <h3>{translations.roleNameLabel}</h3>
          <form onSubmit={handleSaveRole}>
            <div className="form-group">
              <label>{translations.roleNameLabel}</label>
              <input
                type="text"
                className="form-control"
                value={editingRole.rolesName}
                onChange={(e) => setEditingRole({ ...editingRole, rolesName: e.target.value })}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleSaveRole}>{translations.saveButton}</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditingRole(null)}>{translations.cancelEditButton}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminRole;
