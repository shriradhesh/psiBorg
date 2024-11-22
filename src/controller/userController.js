const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { blacklistToken } = require('../utils/tokenBlacklist');

                                                /* User Section */

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
            }
    
// Api for user Register
  
     const user_register = async( req , res)=> {   
              try {
                    const { username , email , password , role } = req.body
                    
                    // check for required fields
                    const required_fields = ['username', 'email', 'password' , 'role']
                    for(let field of required_fields)
                    {
                        if(!req.body[field])
                        {
                            return res.status(400).json({
                                   success : false ,
                                   message : `Required ${field.replace('_',' ')}`
                            })
                        }
                    }

                        // Validate email format
                        if (!isValidEmail(email)) {
                            return res.status(400).json({
                                success: false,
                                message: 'Invalid email format',
                            });
                        }

                    // check for user already exist
                       const exist_user = await userModel.findOne({ email })
                       if(exist_user){
                        return res.status(400).json({
                               success : false ,
                               message : 'User already exists with email'
                        })
                       }

                    // hashed password
                       const hashed_password = await bcrypt.hash(password , 10)
                     // create new user
                     const new_user = new userModel({
                            username ,
                            email ,
                            password : hashed_password,
                            role : role
                     })

                     await new_user.save()

                     return res.status(200).json({
                           success : true ,
                           message : 'User created successfully',
                           user_details : new_user
                     })

              } catch (error) {
                   return res.status(500).json({ 
                         success : false ,
                         message : 'Server error',
                         error_message : error.message
                   })
              }
     }


     // Api for user login
        
          const login = async ( req , res )=> {
               try {
                       const { email , password } = req.body
                       // check for required fields
                       if(!email)
                       {
                        return res.status(400).json({
                               success : false ,
                               message : 'Email Required'
                        })
                       }

                       if(!password)
                        {
                         return res.status(400).json({
                                success : false ,
                                message : 'password Required'
                         })
                        }

                        // check for user
                        const user = await userModel.findOne({ email })
                        if(!user) {
                               return res.status(400).json({
                                 success : false ,
                                 message : 'user not found'
                               })
                        }

                       // Generate JWT token
                        const token = jwt.sign(
                            { id: user._id, role: user.role }, 
                            process.env.JWT_SECRET,
                            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
                        );

                        return res.status(200).json({
                            success: true,
                            message: "Login successful",
                            user_details : user,
                            token,
                        });
                        

               } catch (error) {
                   return res.status(500).json({
                       success : false ,
                       message : 'Server error',
                       error_message : error.message
                   })
               }
          }

             // Api for get user profile

             const get_profile = async (req, res) => {
                   try {
                          const userId = req.params.userId
                          // check for user id required

                          if(!userId)
                          {
                            return res.status(400).json({  
                                   success : false ,
                                   message : 'User Id required'
                            })
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

                          return res.status(200).json({
                                success : true ,
                                message : 'user Details',
                                user : {
                                        username : user.username,
                                        email : user.email,
                                        role : user.role
                                }
                          })

                   } catch (error) {
                       return res.status(500).json({
                           success : false ,
                           message : 'Server error',
                           error_message : error.message
                       })
                   }
             }

             // Api for get all user profiles

             const get_all_users = async( req , res )=> {
                  try {
                          // check for all user
                          const all_user = await userModel.find({ }).sort({ createdAt : -1 }).lean()
                          if(!all_user)
                          {
                              return res.status(400).json({
                                    success : false , 
                                    message : 'No user found'
                              })
                          }

                          return res.status(200).json({
                            success : true ,
                            message : 'All user',
                            all_user : all_user
                          })
                  } catch (error) {
                       return res.status(500).json({
                           success : false ,
                           message : 'server error',
                           error_message : error.message
                           
                       })
                  }

             }

           // APi for logout
          const  logout = async (req, res) => {
            try {

                const token = req.header('Authorization')?.split(' ')[1];

                 blacklistToken(token);

                  res.status(200).json({
                       success : true ,
                      message: 'User logged out successfully' 
                    });
            } catch (error) {
                return res.status(500).json({ 
                    success : false ,
                    message : 'server error',
                    error_message : error.message
                })
            }
        };



     module.exports = { user_register , login  ,  get_profile  , get_all_users , logout }