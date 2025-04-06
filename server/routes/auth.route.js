const express = require("express")
 const {Register , login , getCurrentUser } = require("../controllers/auth.controller")


 const auth = require("../middleware/auth.middileware")


 const router = express.Router()



router.post("/register" , Register)
router.post("/login" , login)

router.get("/me" , auth , getCurrentUser)

module.exports = router