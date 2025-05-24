const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .collection('contacts')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single contact by ID
const getSingleContact = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .collection('contacts')
      .findOne({ _id: contactId });

    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllContacts,
  getSingleContact,
};
