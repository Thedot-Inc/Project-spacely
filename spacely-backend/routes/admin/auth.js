const express = require('express');
const router = express.Router();

const { signup, verify } = require("../../controllers/admin/auth");


router.post("/admin/signup", signup);
router.post("/admin/verify", verify);
// router.post("/resendotp", resendotp);




module.exports = router;