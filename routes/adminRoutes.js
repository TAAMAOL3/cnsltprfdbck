const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  updateUser,  // Neue Funktion für Benutzer bearbeiten
  getRoles,
  deleteRole,
  updateRole,  // Neue Funktion für Rollen bearbeiten
  getTeams,
  deleteTeam,
  updateTeam  // Neue Funktion für Teams bearbeiten
} = require('../controllers/adminController');

// Benutzerverwaltung
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser); // Benutzer bearbeiten

// Rollenverwaltung
router.get('/roles', getRoles);
router.delete('/roles/:id', deleteRole);
router.put('/roles/:id', updateRole); // Rolle bearbeiten

// Teamverwaltung
router.get('/teams', getTeams);
router.delete('/teams/:id', deleteTeam);
router.put('/teams/:id', updateTeam); // Team bearbeiten

module.exports = router;
