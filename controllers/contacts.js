const mongodb = require('../db/connect');
const Joi = require('joi');
const { logger } = require('../swagger');

// Schema for contact validation
const contactSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  favoriteColor: Joi.string().min(3).max(20).required(),
  birthday: Joi.date().iso().required(),
});

async function getNextSequenceValue(sequenceName) {
  const database = mongodb.getDb();
  const result = await database
    .collection('sequences')
    .findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { sequence_value: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
  console.log('Sequence result:', result); // Add this to debug
  return result.sequence_value;
}

// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    logger.info('Fetching all contacts');
    const result = await mongodb
      .getDb()
      .collection('contacts')
      .find()
      .project({ _id: 0 })
      .toArray();

    logger.info(`Successfully fetched ${result.length} contacts`);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    logger.error('miau');
    logger.error('Error fetching contacts', {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to retrieve contacts',
      details: err.message,
    });
  }
};

// Get a single contact by ID
const getSingleContact = async (req, res) => {
  const contactId = parseInt(req.params.id);
  try {
    if (isNaN(contactId)) {
      logger.warn('Invalid contact ID format', { id: req.params.id });
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid contact ID format',
      });
    }

    logger.info(`Fetching contact with ID: ${contactId}`);
    const result = await mongodb
      .getDb()
      .collection('contacts')
      .findOne({ id: contactId }, { projection: { _id: 0 } });

    if (result) {
      logger.info(`Successfully fetched contact with ID: ${contactId}`);
      res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      logger.warn(`Contact not found with ID: ${contactId}`);
      res.status(404).json({
        error: 'Not Found',
        message: 'Contact not found',
      });
    }
  } catch (err) {
    logger.error(`Error fetching contact with ID: ${contactId}`, {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to retrieve contact',
      details: err.message,
    });
  }
};

// Create a new contact
const createContact = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map((d) => d.message),
      });
    }

    const nextId = await getNextSequenceValue('contactId');
    const contact = {
      id: nextId,
      ...value, // Use validated values
    };

    const response = await mongodb
      .getDb()
      .collection('contacts')
      .insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json({
        success: true,
        id: nextId,
      });
    } else {
      res.status(500).json({
        error: 'Database Error',
        message: 'Failed to create contact',
      });
    }
  } catch (err) {
    res.status(500).json({
      error: 'Server Error',
      message: err.message,
    });
  }
};

// Update a contact
const updateContact = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map((d) => d.message),
      });
    }

    const contactId = parseInt(req.params.id);
    const contact = {
      id: contactId,
      ...value, // Use validated values
    };

    const response = await mongodb
      .getDb()
      .collection('contacts')
      .replaceOne({ id: contactId }, contact);

    if (response.modifiedCount > 0) {
      res.status(200).json({
        success: true,
        message: 'Contact updated successfully',
      });
    } else {
      res.status(404).json({
        error: 'Not Found',
        message: 'Contact not found',
      });
    }
  } catch (err) {
    res.status(500).json({
      error: 'Server Error',
      message: err.message,
    });
  }
};

// Delete a contact
const deleteContact = async (req, res) => {
  try {
    const contactId = parseInt(req.params.id);
    if (isNaN(contactId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid contact ID format',
      });
    }

    const response = await mongodb
      .getDb()
      .collection('contacts')
      .deleteOne({ id: contactId });

    if (response.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: 'Contact deleted successfully',
      });
    } else {
      res.status(404).json({
        error: 'Not Found',
        message: 'Contact not found',
      });
    }
  } catch (err) {
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete contact',
      details: err.message,
    });
  }
};

module.exports = {
  getAllContacts,
  getSingleContact,
  createContact,
  updateContact,
  deleteContact,
};
