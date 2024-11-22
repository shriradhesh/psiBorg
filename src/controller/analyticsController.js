const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { blacklistToken } = require('../utils/tokenBlacklist');
const taskModel = require('../models/taskModel')
const { emitEvent } = require('../config/socket.io')

// Api for analytics tasks

     const analytics_task = async ( req , res) => {
        try {
                // check for all tasks 
                const totalTasks = await taskModel.countDocuments();
                // check for completed task
                const completedTasks = await taskModel.countDocuments({ status: 'Completed' });
                // check for pending task
                const pendingTasks = await taskModel.countDocuments({ status: 'Pending' });
                // check for overdue task
                const overdueTasks = await taskModel.countDocuments({
                             dueDate: { $lt: new Date() },
                             status: { $ne: 'Completed' }
                   });

                  return  res.status(200).json({
                    totalTasks,
                    completedTasks,
                    pendingTasks,
                    overdueTasks
                });

        } catch (error) {
              return res.status(500).json
              ({
                  success : false ,
                  message : 'Server error',
                  error_message : error.message
              })
        }
     }


     module.exports = { analytics_task }