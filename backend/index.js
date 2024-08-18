const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authMiddleware = require('./middleware/AuthMiddleware')

require('dotenv').config();


const app = express()

//Routes
const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const podcastRoutes = require('./routes/podcastRoutes')



app.use(cors())
app.use(express.json())

//app.use
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/podcasts', podcastRoutes)

app.get('/api/users/protected-route', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});


mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection

connection.on('connected' , ()=>{
    console.log('Connection Successful')
})
connection.on('error' , ()=>{
    console.log('Connection unsuccessful')
})


const PORT = process.env.PORT || 8081

app.listen(PORT , ()=>{
    console.log("server running on port 8081")
})