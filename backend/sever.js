import express from "express"
import dotenv from "dotenv"
import route from "./route.js"
import mongoose from "mongoose"
import path from "path"
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url';



const app = express();
dotenv.config()

// Middleware to parse cookies
app.use(cookieParser());

const port = process.env.PORT || 4000;


// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser middleware to handle form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html on the base route
app.get('/', (req, res) => {  
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


// Route
app.use('/', route);
 



const startsever = async () => {
    try {
         await mongoose.connect(process.env.MONGO_URI)  
        .then(() => {
            console.log("Connected to MongoDB!");
        });

        app.listen(port, () => {
            console.log(`app  listening on ${port}`);
        })
    } catch (e) {
        console.log(e.message + "Error connecting to Database")
    }  
}   
startsever()   