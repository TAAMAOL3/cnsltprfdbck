const db = require('../config/db');

// Alle Benutzer abrufen
exports.getUsers = (req, res) => {
  const query = 'SELECT * FROM t_users';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('Fehler beim Abrufen der Benutzer.');
    res.json(results);
  });
};

// Benutzer bearbeiten
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { usersEmail, usersVorname, usersNachname, rolesFK } = req.body;
  const query = 'UPDATE t_users SET usersEmail = ?, usersVorname = ?, usersNachname = ?, rolesFK = ? WHERE usersID = ?';
  const values = [usersEmail, usersVorname, usersNachname, rolesFK, id];

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).send('Fehler beim Bearbeiten des Benutzers.');
    res.status(200).send('Benutzer erfolgreich bearbeitet.');
  });
};

// Alle Rollen abrufen
exports.getRoles = (req, res) => {
  const query = 'SELECT * FROM t_roles';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('Fehler beim Abrufen der Rollen.');
    res.json(results);
  });
};

// Rolle bearbeiten
exports.updateRole = (req, res) => {
  const { id } = req.params;
  const { rolesName } = req.body;
  const query = 'UPDATE t_roles SET rolesName = ? WHERE rolesID = ?';
  const values = [rolesName, id];

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).send('Fehler beim Bearbeiten der Rolle.');
    res.status(200).send('Rolle erfolgreich bearbeitet.');
  });
};

// Alle Teams abrufen
exports.getTeams = (req, res) => {
  const query = 'SELECT * FROM t_team';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('Fehler beim Abrufen der Teams.');
    res.json(results);
  });
};

// Team bearbeiten
exports.updateTeam = (req, res) => {
  const { id } = req.params;
  const { teamName, teamLeaderFK } = req.body;
  const query = 'UPDATE t_team SET teamName = ?, teamLeaderFK = ? WHERE teamID = ?';
  const values = [teamName, teamLeaderFK, id];

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).send('Fehler beim Bearbeiten des Teams.');
    res.status(200).send('Team erfolgreich bearbeitet.');
  });
};

// Benutzer löschen
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM t_users WHERE usersID = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send('Fehler beim Löschen des Benutzers.');
    res.status(204).send();
  });
};

// Rolle löschen
exports.deleteRole = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM t_roles WHERE rolesID = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send('Fehler beim Löschen der Rolle.');
    res.status(204).send();
  });
};

// Team löschen
exports.deleteTeam = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM t_team WHERE teamID = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send('Fehler beim Löschen des Teams.');
    res.status(204).send();
  });
};
