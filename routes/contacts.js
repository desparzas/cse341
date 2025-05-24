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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - favoriteColor
 *               - birthday
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The contact's first name
 *               lastName:
 *                 type: string
 *                 description: The contact's last name
 *               email:
 *                 type: string
 *                 description: The contact's email address
 *               favoriteColor:
 *                 type: string
 *                 description: The contact's favorite color
 *               birthday:
 *                 type: string
 *                 description: The contact's birthday
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the created contact
 *       400:
 *         description: Invalid request body
 */
router.post('/', contactsController.createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - favoriteColor
 *               - birthday
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The contact's first name
 *               lastName:
 *                 type: string
 *                 description: The contact's last name
 *               email:
 *                 type: string
 *                 description: The contact's email address
 *               favoriteColor:
 *                 type: string
 *                 description: The contact's favorite color
 *               birthday:
 *                 type: string
 *                 description: The contact's birthday
 *     responses:
 *       204:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 *       400:
 *         description: Invalid request body
 */
router.put('/:id', contactsController.updateContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
router.delete('/:id', contactsController.deleteContact);

module.exports = router;
