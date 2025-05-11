const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contacts');

// GET all contacts
router.get('/', contactsController.getAllContacts);

// GET a single contact by ID
router.get('/:id', contactsController.getSingleContact);

module.exports = router;
