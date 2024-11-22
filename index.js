const express = require('express')
const http = require('http')
require('dotenv').config()
const app = express()
const { initSocket } = require('./src/config/socket.io')
const Port = process.env.PORT || 3200
const cors = require('cors')
const bodyParser = require('body-parser')
const userRouter = require('./src/routes/userRoutes')
const taskRouter = require('./src/routes/taskRoutes')
const taskanalyticsRouter = require('./src/routes/analyticsroutes')
const server = http.createServer(app);
const axios = require('axios')









// Databasde configuration
   require('./src/config/db')



// Middleware configuration
 
app.use(express.json())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(cors())
app.use(express.static('uploads'))

initSocket(server);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
    });




app.get('/', (req ,res)=>{
        res.send('Hello from  Server')
})



app.use('/api', userRouter)
app.use('/api', taskRouter)
app.use('/api' , taskanalyticsRouter)


app.listen(Port , ()=>{
       console.log(`Server is Running on PORT : ${Port}`);
})