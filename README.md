1) Project Overview -
                     The Task Management System is a web application that allows users to manage tasks efficiently. It provides features like user registration, login, task creation, and assignment. Tasks can be filtered by status, priority, and due date, with real-time updates on task changes.

                        Key Features:
                        User Management: Register, log in, and manage profiles with role-based access (Admin, Manager, User).
                        Task Management: Create, update, delete, and assign tasks.
                        Role-Based Access: Different permissions for Admin, Manager, and User.
                        Real-Time Updates: Notifies users about task changes using WebSockets.
                        Analytics: View task statistics (completed, pending, overdue).
                        Caching & Rate Limiting: Improve performance with Redis caching and protect against abuse with rate limiting.
                        Technologies: Node.js, Express, MongoDB, JWT, Socket.io, Redis.
2) Setup Instructions -

               - Clone the repository: git clone https://github.com/shriradhesh/psiBorg.git
                 - Install dependencies: npm install
               - Set up a `.env` file with your MongoDB URI and JWT secret
               - Run the server: npm start
3) APIS -

                   User Section  -
   
                                                    User Registration -
                                                            Method : Post
                                                            Parameters : username , email , password , role
                                                             URL : http://localhost:3201/api/user_register 
                                                               Note - role → Admin , Manager , User
                                                    Login -
                                                            Method : Post
                                                            Parameters :  email , password 
                                                             URL : http://localhost:3201/api/login 
                                                    Get All user -
                                                            Method : GET
                                                    Headers : Authorization → Bearer token , Content-Type → application/json
                                                            URL : http://localhost:3201/api/get_all_users  
                                                    
                                                    Get profile of user -
                                                            Method : GET
                                                    Headers : Authorization → Bearer token , Content-Type → application/json
                                                            URL : http://localhost:3201/api/get_profile/:userId 
                                                    Logout  -
                                                            Method : Post 
                                                            Headers : Authorization → Bearer token , Content-Type → application/json
                                                            URL : http://localhost:3201/api/logout 


Task Section  -
   
                                           Create Task  -
                                                                    Method : Post
                                                                    Parameters : title, description, dueDate, priority
                                      		          Headers : Authorization → Bearer token , Content-Type → application/json
                                                          	         URL : http://localhost:3201/api/createTask/:userId 
                                                                       Note - role → Admin , Manager , User
                                      Get All Tasks  -
                                                                    Method : GET
                                      		         Headers : Authorization → Bearer token , Content-Type → application/json
                                                                    URL : http://localhost:3201/api/get_all_tasks   
                                                      
                                      Update Task  -
                                                                    Method : PUT
                                                                    Parameters -  title, description, dueDate, priority
                                      		         Headers : Authorization → Bearer token , Content-Type → application/json
                                                                    URL : http://localhost:3201/api/updateTask/:taskId 
                                      Delete Task -
                                                                    Method : DELETE
                                                                    Headers : Authorization → Bearer token , Content-Type → application/json
                                                                    URL : http://localhost:3201/api/deleteTask/:taskId 
                                      
                                       Assign  Task  -
                                                                    Method : Post
                                                                    Parameters : userId
                                      		          Headers : Authorization → Bearer token , Content-Type → application/json
                                                          	         URL : http://localhost:3201/api/assignTask/:taskId 
                                                                       Note - role → Admin , Manager 
                                      Get Assign  Task  -
                                                                    Method : GET 
                                                                    Parameters : userId
                                      		          Headers : Authorization → Bearer token , Content-Type → application/json
                                                          	         URL : http://localhost:3201/api/getAssignTask/:userId 
                                                                       Note - role → Admin , Manager , User
                                      Update Assign  Task  -
                                                                    Method : PUT
                                                                    Parameters : userId
                                      		          Headers : Authorization → Bearer token , Content-Type → application/json
                                                          	         URL :http://localhost:3201/api/updateAssignTask/:taskId  
                                                                       Note - role → Admin , Manager 

                                                                       
                                      





