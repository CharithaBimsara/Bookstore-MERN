import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import bookRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

//Middleware for parsing request body

app.use(express.json());

//middleware for handling CORS PLOICY
//Option 1 : Allow all origins with default of cors(*)
app.use(cors());
//options 2: Allow Custom origins
// app.use(
//     cors({
//         origin: 'http://localhost:5555',
//         methods:['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders:['Content-Type'],
//     })
// );


app.get("/", (request, response) => {
    console.log("Request received at /");
    return response.status(200).send("Welcome To MERN stack Tutorial");
});

app.use('/books', bookRoute);


mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening to port : ${PORT}`);
        });

    })
    .catch((error) => {
        console.log(error);

    })
