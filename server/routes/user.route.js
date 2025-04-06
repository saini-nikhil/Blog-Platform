const express = require("express")

const {getUserProfile , updateProfile , getUsers}  = require("../controllers/users.controller")

const auth = require("../middleware/auth.middileware")


const router = express.Router()
router.get('/profile/:id', getUserProfile);

router.get('/profile', auth, getUserProfile);

router.put('/profile', auth, updateProfile);
router.get('/', getUsers);

module.exports = router