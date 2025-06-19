import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import athletesRoute from "./routes/athletesRoute.js"
import dataRoute from "./routes/dataRoute.js"
import metricsRoute from "./routes/metricsRoute.js"

dotenv.config()

const app = express()

// middleware
app.use(rateLimiter)
app.use(express.json())

const PORT = process.env.PORT || 5001

app.use("/api/athletes", athletesRoute)
app.use("/api/data", dataRoute)
app.use("/api/metrics", metricsRoute)

// Fetch all sports
app.get("/api/sports", async(req, res) => {
    
    try {
        const sports = [
            {"sport": "Baseball"},
            {"sport": "Basketball"},
            {"sport": "Field Hockey"},
            {"sport": "Football"},
            {"sport": "Golf"},
            {"sport": "Gymnastics"},
            {"sport": "Ice Hockey"},
            {"sport": "Lacrosse"},
            {"sport": "Soccer"},
            {"sport": "Softball"},
            {"sport": "Swimming"},
            {"sport": "Tennis"},
            {"sport": "Track and Field"},
            {"sport": "Volleyball"},
            {"sport": "Wrestling"},
        ]

        res.status(200).json(sports)
    } catch (error) {
        console.log("Error fetching sports", error)
        res.status(500).json({message:"Internal server error"})
    }
    
})

initDB().then(() => {
    app.listen(PORT ,() => {
        console.log("Server is running on PORT:", PORT);
    })
})