const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
               username : { 
                type: String,
             
                 },

                email : { 
                    type: String, 
                   
                     },
                password : { 
                    type: String, 
                     },
                     
              role : { 
                   type: String,
                   enum : ['Admin' , 'Manager' , 'User'] ,
                   default: 'User'
                 } 
} , { timestamps : true });


const userModel = mongoose.model('User', UserSchema)
module.exports = userModel
