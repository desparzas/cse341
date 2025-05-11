const express = require('express');
const router = express.Router();

router.use('/contacts', require('./contacts'));

router.get('/', (req, res) => {
  res.send('Welcome to the Contacts API');
});

module.exports = router;
