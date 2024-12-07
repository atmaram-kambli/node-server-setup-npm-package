import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import dotenv from 'dotenv';
dotenv.config();

import connectToMongoDB from './config/connectDB.js';
import userRouter from './routes/user.route.js';

const app = express();

// Middlewares
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('combined'))
app.use(helmet({
    crossOriginResourcePolicy : false
}))

const PORT = 8080 || process.env.PORT;

app.get('/', (req, res) => {
    res.send("Hi There!");

})

app.use('/api/user', userRouter)


connectToMongoDB().then( () => {
    app.listen(PORT, () => {
        console.log("Server is running of PORT", PORT);
    })
});