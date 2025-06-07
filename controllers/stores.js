const mongodb = require('../db/connect');
const Joi = require('joi');
const { logger } = require('../swagger');

const storeSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(5).max(200).required(),
  city: Joi.string().min(2).max(100).required(),
  state: Joi.string().length(2).required(),
  zipCode: Joi.string().min(5).max(10).required(),
  phone: Joi.string().min(10).max(20).required(),
  email: Joi.string().email().required(),
});

// Helper function to generate sequential IDs
async function getNextStoreId() {
  const database = mongodb.getDb();
  const result = await database
    .collection('counters')
    .findOneAndUpdate(
      { _id: 'storeId' },
      { $inc: { sequence_value: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
  return result.sequence_value;
}

const getAllStores = async (req, res) => {
  try {
    logger.info('Fetching all stores');
    const result = await mongodb
      .getDb()
      .collection('stores')
      .find()
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err) {
    logger.error('Error fetching stores', { error: err.message });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to retrieve stores',
      details: err.message,
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);
    if (isNaN(storeId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid store ID format',
      });
    }

    const result = await mongodb
      .getDb()
      .collection('stores')
      .findOne({ id: storeId });

    if (result) {
      res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      res.status(404).json({
        error: 'Not Found',
        message: 'Store not found',
      });
    }
  } catch (err) {
    logger.error(`Error fetching store ${req.params.id}`, {
      error: err.message,
    });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to retrieve store',
      details: err.message,
    });
  }
};

// Create new store
const createStore = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = storeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map((d) => d.message),
      });
    }

    const storeId = await getNextStoreId();
    const store = {
      id: storeId,
      ...value,
      createdAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection('stores')
      .insertOne(store);

    if (response.acknowledged) {
      res.status(201).json({
        success: true,
        id: storeId,
        message: 'Store created successfully',
      });
    } else {
      throw new Error('Store creation not acknowledged');
    }
  } catch (err) {
    logger.error('Error creating store', { error: err.message });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to create store',
      details: err.message,
    });
  }
};

// Update store
const updateStore = async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);
    if (isNaN(storeId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid store ID format',
      });
    }

    // Validate request body
    const { error, value } = storeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map((d) => d.message),
      });
    }

    const response = await mongodb
      .getDb()
      .collection('stores')
      .updateOne({ id: storeId }, { $set: value });

    if (response.matchedCount === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Store not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      modifiedCount: response.modifiedCount,
    });
  } catch (err) {
    logger.error(`Error updating store ${req.params.id}`, {
      error: err.message,
    });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update store',
      details: err.message,
    });
  }
};

// Delete store
const deleteStore = async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);
    if (isNaN(storeId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid store ID format',
      });
    }

    const response = await mongodb
      .getDb()
      .collection('stores')
      .deleteOne({ id: storeId });

    if (response.deletedCount === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Store not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Store deleted successfully',
    });
  } catch (err) {
    logger.error(`Error deleting store ${req.params.id}`, {
      error: err.message,
    });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete store',
      details: err.message,
    });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
};
