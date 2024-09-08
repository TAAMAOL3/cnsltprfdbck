import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { translate } from './translateFunction'; // Import the translate function

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); 
  const [teams, setTeams] = useState([]); 
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // State for translations
  const [translations, setTranslations] = useState({
    userManagement: '',
    firstNameLabel: '',
    lastNameLabel: '',
    emailLabel: '',
    roleLabel: '',
    teamLabel: '',
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
      const userManagement = await translate(130); // "Benutzerverwaltung"
      const firstNameLabel = await translate(131); // "Vorname"
      const lastNameLabel = await translate(132); // "Nachname"
      const emailLabel = await translate(133); // "E-Mail"
      const roleLabel = await translate(134); // "Rolle"
      const teamLabel = await translate(135); // "Team"
      const actionsLabel = await translate(136); // "Aktionen"
      const editButton = await translate(137); // "Bearbeiten"
      const deleteButton = await translate(138); // "Löschen"
      const confirmDeleteButton = await translate(139); // "Wirklich löschen?"
      const cancelButton = await translate(140); // "Abbrechen"
      const saveButton = await translate(141); // "Speichern"
      const cancelEditButton = await translate(142); // "Abbrechen"

      setTranslations({
        userManagement,
        firstNameLabel,
        lastNameLabel,
        emailLabel,
        roleLabel,
        teamLabel,
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
    const fetchUsers = async () => {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    };

    const fetchRoles = async () => {
      const response = await axios.get('/api/admin/roles');
      setRoles(response.data);
    };

    const fetchTeams = async () => {
      const response = await axios.get('/api/admin/teams');
      setTeams(response.data);
    };

    Promise.all([fetchUsers(), fetchRoles(), fetchTeams()]).then(() => {
      console.log('Users, Roles, and Teams loaded.');
    });
  }, []);

  const getRoleName = (roleId) => {
    const numericRoleId = parseInt(roleId, 10);
    const role = roles.find(role => role.rolesID === numericRoleId);
    return role ? role.rolesName : 'Unbekannt';
  };

  const getTeamName = (teamId) => {
    const numericTeamId = parseInt(teamId, 10);
    const team = teams.find(team => team.teamID === numericTeamId);
    return team ? team.teamName : 'Kein Team';
  };

  const confirmDelete = (userId) => {
    setDeletingUserId(userId);
  };

  const cancelDelete = () => {
    setDeletingUserId(null);
  };

  const handleDeleteUser = async (userId) => {
    await axios.delete(`/api/admin/users/${userId}`);
    setUsers(users.filter((user) => user.usersID !== userId));
    setDeletingUserId(null);
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

      setUsers(prevUsers => 
        prevUsers.map((user) =>
          user.usersID === usersID
            ? {
                ...user,
                usersEmail,
                usersVorname,
                usersNachname,
                rolesFK,
                teamFK,
                roleName: getRoleName(rolesFK),
                teamName: getTeamName(teamFK)
              }
            : user
        )
      );

      setEditingUser(null);
    } catch (error) {
      console.error('Fehler beim Speichern des Benutzers:', error);
    }
  };

  return (
    <div className="mb-5">
      <h3>{translations.userManagement}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>{translations.firstNameLabel}</th>
            <th>{translations.lastNameLabel}</th>
            <th>{translations.emailLabel}</th>
            <th>{translations.roleLabel}</th>
            <th>{translations.teamLabel}</th>
            <th>{translations.actionsLabel}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr 
              key={user.usersID}
              className={user.teamFK === 0 ? 'bg-pastel-yellow' : ''}
            >
              <td>{user.usersVorname}</td>
              <td>{user.usersNachname}</td>
              <td>{user.usersEmail}</td>
              <td>{getRoleName(user.rolesFK)}</td>
              <td>{user.teamName || getTeamName(user.teamFK)}</td>
              <td>
                <button className="btn btn-primary" onClick={() => setEditingUser(user)}>{translations.editButton}</button>
                {deletingUserId === user.usersID ? (
                  <>
                    <button className="btn btn-danger mr-2" onClick={() => handleDeleteUser(user.usersID)}>{translations.confirmDeleteButton}</button>
                    <button className="btn btn-secondary" onClick={cancelDelete}>{translations.cancelButton}</button>
                  </>
                ) : (
                  <button className="btn btn-danger" onClick={() => confirmDelete(user.usersID)}>{translations.deleteButton}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="mb-5">
          <h3>{translations.firstNameLabel} {translations.lastNameLabel}</h3>
          <form onSubmit={handleSaveUser}>
            <div className="form-group">
              <label>{translations.emailLabel}</label>
              <input
                type="email"
                className="form-control"
                value={editingUser.usersEmail}
                onChange={(e) => setEditingUser({ ...editingUser, usersEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{translations.firstNameLabel}</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.usersVorname}
                onChange={(e) => setEditingUser({ ...editingUser, usersVorname: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{translations.lastNameLabel}</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.usersNachname}
                onChange={(e) => setEditingUser({ ...editingUser, usersNachname: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{translations.roleLabel}</label>
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
              <label>{translations.teamLabel}</label>
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
            <button type="button" className="btn btn-primary" onClick={handleSaveUser}>{translations.saveButton}</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditingUser(null)}>{translations.cancelEditButton}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUser;
