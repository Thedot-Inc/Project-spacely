const express = require('express');
const router = express.Router();

const { signup, verify, resendotp } = require("../../controllers/user/auth");


router.post("/signup", signup);
router.post("/verify", verify);
router.post("/resendotp", resendotp);




module.exports = router;