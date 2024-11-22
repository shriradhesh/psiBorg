const express = require('express')
const router = express.Router()
const upload = require('../../upload')
const authenticate = require('../middleware/auth')
const userController = require('../controller/userController')
const roleCheck = require('../middleware/role_auth')

const rateLimit = require('express-rate-limit')

const registerLimiter = rateLimit({
   windowMs: 25 * 60 * 1000, 
   max: 15, 
   message: 'Too many registration attempts from this IP, please try again later.'
})

                                                /* user section */

    // Api for user Register
    
       router.post('/user_register' , registerLimiter , userController.user_register)
    // Api for Login
       router.post('/login', userController.login)
    // Api for get_profile
       router.get('/get_profile/:userId', authenticate, roleCheck(['User', 'Manager', 'Admin']), userController.get_profile);
    // Api for get_all_users
       router.get('/get_all_users', authenticate, roleCheck(['Admin']), userController.get_all_users)
    // Api for logout
       router.post('/logout', authenticate , userController.logout)


    module.exports = router;