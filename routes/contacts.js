const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contacts');

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Returns all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: A list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The contact ID
 *                   firstName:
 *                     type: string
 *                     description: The contact's first name
 *                   lastName:
 *                     type: string
 *                     description: The contact's last name
 *                   email:
 *                     type: string
 *                     description: The contact's email address
 *                   favoriteColor:
 *                     type: string
 *                     description: The contact's favorite color
 *                   birthday:
 *                     type: string
 *                     description: The contact's birthday
 */
router.get('/', contactsController.getAllContacts);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The contact ID
 *                 firstName:
 *                   type: string
 *                   description: The contact's first name
 *                 lastName:
 *                   type: string
 *                   description: The contact's last name
 *                 email:
 *                   type: string
 *                   description: The contact's email address
 *                 favoriteColor:
 *                   type: string
 *                   description: The contact's favorite color
 *                 birthday:
 *                   type: string
 *                   description: The contact's birthday
 *       404:
 *         description: Contact not found
 */
router.get('/:id', contactsController.getSingleContact);

module.exports = router;
