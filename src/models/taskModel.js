const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    
        title : {
               type : String ,
               },

       description : { 
             type : String
             },

       dueDate : {
            type: Date
            },

    priority : {
           type : String,
           enum : ['Low', 'Medium', 'High'],
           default: 'Medium' 
        },

    status : {
         type: String ,
         enum: ['Pending', 'In Progress', 'Completed' , 'Overdue'],
         default: 'Pending'
         },

    createdBy : {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'userModel', 
        
         },

    assignedTo : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'userModel' 
    }, 
} , { timestamps : true });

   const taskModel = new mongoose.model('task', TaskSchema)
   module.exports = taskModel;