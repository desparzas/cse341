const mongodb = require('../db/connect');

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
    const result = await mongodb
      .getDb()
      .collection('contacts')
      .find()
      .project({ _id: 0 })
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
    const contactId = parseInt(req.params.id);
    const result = await mongodb
      .getDb()
      .collection('contacts')
      .findOne({ id: contactId }, { projection: { _id: 0 } });

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

// Create a new contact
const createContact = async (req, res) => {
  try {
    const nextId = await getNextSequenceValue('contactId');
    console.log('Next ID:', nextId); // Add this to debug
    const contact = {
      id: nextId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };

    const response = await mongodb
      .getDb()
      .collection('contacts')
      .insertOne(contact);
    


    if (response.acknowledged) {
      res.status(201).json({ id: nextId });
    } else {
      res.status(500).json({ message: 'Error creating contact' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a contact
const updateContact = async (req, res) => {
  try {
    const contactId = parseInt(req.params.id);
    const contact = {
      id: contactId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };

    const response = await mongodb
      .getDb()
      .collection('contacts')
      .replaceOne({ id: contactId }, contact);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a contact
const deleteContact = async (req, res) => {
  try {
    const contactId = parseInt(req.params.id);
    const response = await mongodb
      .getDb()
      .collection('contacts')
      .deleteOne({ id: contactId });

    if (response.deletedCount > 0) {
      res.status(204).send();
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
  createContact,
  updateContact,
  deleteContact,
};
