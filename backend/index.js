import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path';

// configrstion of database

dotenv.config();


// create a express App

const app = express()
const PORT = process.env.PORT || 8000 ;


app.use(cors({origin: "http://localhost:5173",credentials: true}));


const _dirname = path.resolve();

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname, "frontend/dist")));
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(_dirname,"fronted","dist","index.html"))
    })
}

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
