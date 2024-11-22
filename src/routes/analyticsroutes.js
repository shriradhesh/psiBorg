const express = require('express')
const router = express.Router()
const upload = require('../../upload')
const authenticate = require('../middleware/auth')
const userController = require('../controller/userController')
const taskController = require('../controller/taskController')
const analyticsController = require('../controller/analyticsController')
const roleCheck = require('../middleware/role_auth')



// Api for task analytics

     router.get('/analytics_task', authenticate, roleCheck(['Admin', 'Manager']), analyticsController.analytics_task)


     module.exports = router