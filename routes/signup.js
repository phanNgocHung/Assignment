var express = require('express');
var router = express.Router();
var signupCTRL= require("../controllers/admin.controller");
router.post("/signup", signupCTRL.Signup);

/* GET home page. */

  
module.exports = router;