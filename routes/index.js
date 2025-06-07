const express = require('express');
const router = express.Router();

router.use('/products', require('./products'));
router.use('/stores', require('./stores'));

router.get('/', (req, res) => {
  res.send('Welcome to the Products API');
});

module.exports = router;
