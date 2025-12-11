import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import athletesRoute from "./routes/athletesRoute.js"
import dataRoute from "./routes/dataRoute.js"
import metricsRoute from "./routes/metricsRoute.js"

import job from "./config/cron.js"

dotenv.config()

const app = express()

if(process.env.NODE_ENV==="production") job.start();

// middleware
app.use(rateLimiter)
app.use(express.json())

const PORT = process.env.PORT || 5001

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok"});
});

app.use("/api/athletes", athletesRoute)
app.use("/api/data", dataRoute)
app.use("/api/metrics", metricsRoute)

// Fetch all sports
app.get("/api/sports", async(req, res) => {
    
    try {
        const sports = [
            {"id": 0, "sport": "Baseball"},
            {"id": 1, "sport": "Basketball"},
            {"id": 2, "sport": "Field Hockey"},
            {"id": 3, "sport": "Football"},
            {"id": 4, "sport": "Golf"},
            {"id": 5, "sport": "Gymnastics"},
            {"id": 6, "sport": "Ice Hockey"},
            {"id": 7, "sport": "Lacrosse"},
            {"id": 8, "sport": "Soccer"},
            {"id": 9, "sport": "Softball"},
            {"id": 10, "sport": "Swimming"},
            {"id": 11, "sport": "Tennis"},
            {"id": 12, "sport": "Track & Field"},
            {"id": 13, "sport": "Volleyball"},
            {"id": 14, "sport": "Wrestling"},
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