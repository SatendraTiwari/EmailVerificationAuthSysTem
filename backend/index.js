import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';


// configrstion of database

dotenv.config();


// create a express App

const app = express()
const PORT = process.env.PORT || 8000 ;

// express json parse 

app.use(express.json()) //allows us to incoming requests with JSON payloads  : res.body
app.use(cookieParser());

app.get('/',(req,res) => {
    res.send('Hello World')
})


// Routers SetUp 

app.use('/api/auth', authRoutes)

app.listen(8000,() => {
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})
