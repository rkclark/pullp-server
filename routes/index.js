const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const ping = { ping: 'pong' };
  const pingResponse = JSON.stringify(ping);
  res.send(pingResponse);
});

module.exports = router;
