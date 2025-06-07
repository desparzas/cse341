const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated');

router.use('/products', isAuthenticated, require('./products'));
router.use('/stores', isAuthenticated, require('./stores'));

router.get('/', isAuthenticated, (req, res) => {
  res.send('Welcome to the Products API');
});

module.exports = router;
