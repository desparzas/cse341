const mongodb = require('../db/connect');
const Joi = require('joi');
const { logger } = require('../swagger');

// Product schema with 7+ fields
const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().min(0).precision(2).required(),
  category: Joi.string().valid('electronics', 'clothing', 'food', 'home', 'other').required(),
  stock: Joi.number().integer().min(0).required(),
  manufacturer: Joi.string().min(3).max(100).required(),
  isActive: Joi.boolean().required(),
  createdAt: Joi.date().default(Date.now)
});

// Helper function to generate sequential IDs
async function getNextProductId() {
  const database = mongodb.getDb();
  const result = await database
    .collection('counters')
    .findOneAndUpdate(
      { _id: 'productId' },
      { $inc: { sequence_value: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
  return result.sequence_value;
}

// Get all products
const getAllProducts = async (req, res) => {
  try {
    logger.info('Fetching all products');
    const result = await mongodb
      .getDb()
      .collection('products')
      .find()
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    logger.error('Error fetching products', { error: err.message });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to retrieve products',
      details: err.message
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid product ID format'
      });
    }

    const result = await mongodb
      .getDb()
      .collection('products')
      .findOne({ id: productId });

    if (result) {
      res.status(200).json({
        success: true,
        data: result
      });
    } else {
      res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }
  } catch (err) {
    logger.error(`Error fetching product ${req.params.id}`, { error: err.message });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to retrieve product',
      details: err.message
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map(d => d.message)
      });
    }

    const productId = await getNextProductId();
    const product = {
      id: productId,
      ...value,
      createdAt: new Date()
    };

    const response = await mongodb
      .getDb()
      .collection('products')
      .insertOne(product);

    if (response.acknowledged) {
      res.status(201).json({
        success: true,
        id: productId,
        message: 'Product created successfully'
      });
    } else {
      throw new Error('Product creation not acknowledged');
    }
  } catch (err) {
    logger.error('Error creating product', { error: err.message });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to create product',
      details: err.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid product ID format'
      });
    }

    // Validate request body
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map(d => d.message)
      });
    }

    const response = await mongodb
      .getDb()
      .collection('products')
      .updateOne(
        { id: productId },
        { $set: value }
      );

    if (response.matchedCount === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      modifiedCount: response.modifiedCount
    });
  } catch (err) {
    logger.error(`Error updating product ${req.params.id}`, { error: err.message });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update product',
      details: err.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid product ID format'
      });
    }

    const response = await mongodb
      .getDb()
      .collection('products')
      .deleteOne({ id: productId });

    if (response.deletedCount === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    logger.error(`Error deleting product ${req.params.id}`, { error: err.message });
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete product',
      details: err.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};