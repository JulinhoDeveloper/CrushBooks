const express = require('express')
const router = express.Router()
const UserCtrl = require('../controllers/userController')
const AdminCtrl = require('../controllers/adminController')
const { protect, admin } = require('../middleware/authMiddleware')

router
    .route('/')
    .post(UserCtrl.registerUser)
    .get(protect, admin, AdminCtrl.getAllUsers)

router.post('/login', UserCtrl.authUser)

router
    .route('/profile')
    .get(protect, UserCtrl.getUserProfile)
    .put(protect, UserCtrl.updateUserProfile)

router
    .route('/:id')
    .get(protect, admin, AdminCtrl.getUserById)
    .put(protect, admin, AdminCtrl.updatedUser)
    .delete(protect, admin, AdminCtrl.deleteUser)

module.exports = router