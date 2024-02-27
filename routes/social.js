const express = require('express');
const router = express.Router();

const socialController = require('../app/api/controllers/social');
router.get('/', socialController.listSocials);
router.post('/', socialController.CreateSocial);
module.exports = router;