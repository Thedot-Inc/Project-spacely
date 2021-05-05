const express = require('express');
const router = express.Router();
const { userprofile } = require("../../controllers/user/userprofile");


router.post("/userprofile", userprofile)


module.exports = router;