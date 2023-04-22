// import  { Request, Response } from 'express'
import * as express from 'express';
import * as morgan from 'morgan'
import { config } from 'dotenv';
import { env } from 'process'
config();


// routes
import usersRouter from './users/users.controller'
import booksRouter from './books/books.controller'


const PORT = env.PORT;
const app = express()

app.use(express.json())

app.use(morgan("common"))

// routes
app.get("/", (req: express.Request, res: express.Response) => {
    return res.status(200).json({ status: 200, message: "Server sent a pong" })
})
app.use('/users', usersRouter)
app.use('/books', booksRouter)
app.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT + " !")
})