const express = require('express')
const router = express.Router()
const upload = require('../../upload')
const authenticate = require('../middleware/auth')
const userController = require('../controller/userController')
const taskController = require('../controller/taskController')
const roleCheck = require('../middleware/role_auth')

                                                    /* task section */

    // api for createTask

     router.post('/createTask/:userId',authenticate, roleCheck(['User', 'Manager', 'Admin']), taskController.createTask)
    // Api for get_all_tasks
     router.get('/get_all_tasks', authenticate, roleCheck(['User', 'Manager', 'Admin']), taskController.get_all_tasks)
     // Api for updateTask
     router.put('/updateTask/:taskId', authenticate, roleCheck(['User', 'Manager', 'Admin']), taskController.updateTask)
     // Api for deleteTask
     router.delete('/deleteTask/:taskId', authenticate, roleCheck(['Admin']), taskController.deleteTask)

     // Api for assignTask
     router.post('/assignTask/:taskId', authenticate, roleCheck(['Manager', 'Admin']), taskController.assignTask)
     // Api for get asignTask
     router.get('/getAssignTask/:userId', authenticate, roleCheck(['User', 'Manager', 'Admin']), taskController.getAssignTask)
     // Api for updateAssignTask
     router.put('/updateAssignTask/:taskId', authenticate, roleCheck(['Manager', 'Admin']), taskController.updateAssignTask)



     module.exports = router