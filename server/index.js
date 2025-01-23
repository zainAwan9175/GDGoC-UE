import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Load environment variables
import mongodbconnection from "./mongodb-connection.js";
import { upcomingeventRouter } from "./Route/upcomingevent_Route.js";
import { teamrouter } from "./Route/TeamRoute.js";
mongodbconnection();



const app = express();
const port = process.env.PORT || 3001; // Set the port from the environment variable or default to 3001

// Middleware
app.use(express.json());
app.use(cors());
app.use(cors({
    origin: ['https://gd-go-c-ue-client.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    "maxAgeSeconds":2600,
    "respoponseHeader":["Content-Type"],
    credentials: true,
}));

// Routes
app.get('/', (req, res) => {
    res.send('Hello GDGOC');
});
app.use("/upcomingevent",upcomingeventRouter)
app.use("/team",teamrouter)
// Start server
app.listen(port, () => {
    console.log(`Server is running on https://gd-go-c-ue.vercel.app/ :${port}`);
});
