const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { blacklistToken } = require('../utils/tokenBlacklist');
const taskModel = require('../models/taskModel')
const { emitEvent } = require('../config/socket.io')

                                                      /* Task section */

// Api for create task
        const createTask = async( req , res ) => {
              try {
                      const userId = req.params.userId
                      // check for userId
                      if(!userId)
                      {
                          return res.status(400).json({
                               success : false ,
                               message : 'User Id Required'
                          })
                      }
                        
                      const { title, description, dueDate, priority } = req.body;

                      // check for required fields
                      const requiredFields =['title', 'description', 'dueDate', 'priority']
                      for(let field of requiredFields) {
                            if(!req.body[field])
                            {
                                    return res.status(400).json
                                    ({
                                           success : false ,
                                           message : `Required ${field.replace('_', ' ')}`
                                    })
                            }
                          }
                                // check for user
                                const user = await userModel.findOne({ _id : userId })
                                if(!user)
                                { 
                                      return res.status(400).json({
                                          success : false ,
                                          message : 'User not found'
                                      })
                                }

                          // check for task already exists
                          const exist_task = await taskModel.findOne({ title })
                          if(exist_task)
                          { 
                               return res.status(400).json({ 
                                  success : false ,
                                  message : 'Task already exist with the title' })
                          }

                          // add new task
                                const task = new Task({
                                    title,
                                    description,
                                    dueDate,
                                    priority,
                                    createdBy : userId, 
                                });
                                await task.save();
                
              } catch (error) {
                   return res.status(500).json
                   ({
                        success : false ,
                        message : 'Server error',
                        error_message : error.message
                   })
              }
        }


        // Api for get all tasks
         
             const get_all_tasks = async ( req , res) => {
                    try {                        
                        const { status, priority  } = req.query
                        const query = {}
                    if (status) query.status = status
                    if (priority) query.priority = priority

                            // check for all task
                            const allTasks = await taskModel.find(query).sort({ createdAt : -1 })
                            .populate('createdBy', 'username email')
                            .populate('assignedTo', 'username email')

                            if(!allTasks)
                            {
                                return res.status(400).json({
                                       success : false ,
                                       message : 'No tasks found'
                                })
                            }

                            return res.status(200).json({
                                success : true ,
                                message : 'all Task',
                                tasks : tasks
                            })
                    } catch (error) {
                           return res.status(500).json({
                               success : false ,
                               message : 'Server error',
                               error_message : error.message
                           })
                    }
             }

        // Api for update task

             const updateTask = async (req, res) => {
                  try {
                         const taskId = req.params.taskId
                         //check for taskId
                         if(!taskId) {
                               return res.status(400).json({
                                   success : false ,
                                   message : 'TaskId Required'
                               })
                         }

                         const { title, description, dueDate, priority} = req.body
                       // check for task
                           const task = await taskModel.findOne({ _id : taskId })
                           if(!task)
                           {
                               return res.status(400).json({
                                   success : false ,
                                   message : 'Task not found'
                               })
                           }

                           if(title)
                           {
                                 task.title = title
                           }
                           if(description)
                            {
                                  task.description = description
                            }
                           if(dueDate)
                            {
                                  task.dueDate = dueDate
                            }
                           if(priority)
                            {
                                  task.priority = priority
                            }

                            await task.save()

                            return res.status(200).json({
                                   success : true ,
                                   message : 'Task updated successfully'
                            })
                  } catch (error) {
                       return res.status(400).json({
                           success : false ,
                           message : 'Server error',
                           error_message : error.message
                       })
                  }
             }

    // Api for delete task
          const deleteTask = async (req, res) => {
               try {
                const taskId = req.params.taskId
                //check for taskId
                if(!taskId) {
                      return res.status(400).json({
                          success : false ,
                          message : 'TaskId Required'
                      })
                }
                    // check for task

                const task = await taskModel.findOne({ _id : taskId })
                if(!task)
                {
                    return res.status(400).json({
                        success : false ,
                        message : 'Task not found'
                    })
                }
                await task.deleteOne()
                  return res.status(400).json({
                         success : true ,
                         message : 'Task deleted successfully'
                  })
               } catch (error) {
                   return res.status(500).json({
                       success : false ,
                       message : 'Server error',
                       error_message : error.message
                   })
               }
          }


    // Api for assign task
              const assignTask = async ( req , res) => {
                    try {
                           const taskId = req.params.taskId
                           const userId = req.body.userId 

                           // check for taskId and userId 
                           if(!taskId) {
                            return res.status(400).json({
                                success : false ,
                                message : 'TaskId Required'
                            })
                      }
                           if(!userId) {
                            return res.status(400).json({
                                success : false ,
                                message : 'userId Required'
                            })
                      }
                          // check for task
      
                      const task = await taskModel.findOne({ _id : taskId })
                      if(!task)
                      {
                          return res.status(400).json({
                              success : false ,
                              message : 'Task not found'
                          })
                      }

                          // check for user
                          const user = await userModel.findOne({ _id : userId })
                          if(!user)
                          {
                              return res.status(400).json({
                                  success : false ,
                                  message : 'user not found'
                              })
                          }
                                        // only managers or admins can assign tasks
                    if (!req.user.role.includes('Admin') && !req.user.role.includes('Manager')) {
                        return res.status(400).json({
                              success : false ,
                               message: 'You are not authorized to assign tasks' 
                            });
                    }


                          task.assignedTo = userId;
                          await task.save();

                          res.status(200).json({
                              success : true ,
                              message : 'task assigned successfully',
                              task : task
                          })
                    } catch (error) {
                        return res.status(500).json({
                            success : false ,
                            message : 'Server error',
                            error_message : error.message
                        })  
                    }
              }

              // Api for get assign task

                  const getAssignTask = async( req , res) => {
                         try {
                               const userId = req.params.userId
                               if(!userId) {
                                return res.status(400).json({
                                    success : false ,
                                    message : 'userId Required'
                                })
                          }
                                        // check for tasks
                                    const tasks = await taskModel.find({ assignedTo: userId })
                                    .populate('assignedTo', 'username email')
                                   .populate('createdBy', 'username email')

                                   if(!tasks)
                                   {
                                      return res.status(400).json({
                                          success : false ,
                                          message : 'no task assigned to user'
                                      })
                                   }
                                      return res.status(200).json({
                                        success : true ,
                                        message : 'All tasks of user',
                                        tasks : tasks
                                        });
                         } catch (error) {
                              return res.status(500).json({
                                   success : false,
                                   message : 'server error',
                                   error_message : error.message
                              })
                         }
                  }


    // Api for update assign task
          const updateAssignTask = async ( req , res) => {
                try {
                       const taskId = req.params.taskId;
                       const userId = req.body.userId

                       // check for taskId and userId 
                       if(!taskId) {
                        return res.status(400).json({
                            success : false ,
                            message : 'TaskId Required'
                        })
                  }
                       if(!userId) {
                        return res.status(400).json({
                            success : false ,
                            message : 'userId Required'
                        })
                  }
                      // check for task
  
                  const task = await taskModel.findOne({ _id : taskId })
                  if(!task)
                  {
                      return res.status(400).json({
                          success : false ,
                          message : 'Task not found'
                      })
                  }

                      // check for user
                      const user = await userModel.findOne({ _id : userId })
                      if(!user)
                      {
                          return res.status(400).json({
                              success : false ,
                              message : 'user not found'
                          })
                      }

                       // Ensure that the logged-in user is a manager or admin
                    if (!req.user.role.includes('Admin') && !req.user.role.includes('Manager')) {
                        return res.status(400).json({ 
                            success : false ,
                            message: 'You are not authorized to update task assignments' });
                    }

                                    // Assign the new user to the task
                        task.assignedTo = userId;
                        await task.save();

                            // Emit task update event
                          emitEvent('taskUpdated', task);
                          
                        res.status(200).json({
                            success : true ,
                            message: 'Task assignment updated successfully',
                            task : task
                        });
                } catch (error) {
                      return res.status(500).json({
                           success : false ,
                           message : 'server error',
                           error_message : error.message
                      })
                }
          }
        module.exports = { createTask  , get_all_tasks , updateTask , deleteTask , 
            assignTask , getAssignTask , updateAssignTask}