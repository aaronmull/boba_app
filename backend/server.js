import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config()

const app = express()

// middleware
app.use(express.json())

// function inchesToFeetInchesString(totalInches) {
//     const feet = Math.floor(totalInches / 12)
//     const inches = totalInches % 12
//     return `${feet}'${inches}"`
// }

const PORT = process.env.PORT || 5001

async function initDB(){
    try {

        // athletes table
        await sql`CREATE TABLE IF NOT EXISTS athletes(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            dob DATE,
            gender VARCHAR(255) NOT NULL,
            sport VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        // data table
        await sql`CREATE TABLE IF NOT EXISTS data(
            id SERIAL PRIMARY KEY,
            athlete VARCHAR(255) NOT NULL,
            metric VARCHAR(255) NOT NULL,
            measurement FLOAT NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE,
            show_on_leaderboard BOOLEAN NOT NULL DEFAULT 'false'
        )`

        // metrics table
        await sql`CREATE TABLE IF NOT EXISTS metrics(
            id SERIAL PRIMARY KEY,
            metric VARCHAR(255) NOT NULL,
            units VARCHAR(255) NOT NULL,
            is_time BOOL NOT NULL
        )`

        console.log("Database initialized successfully")
    } catch (error) {
        console.log("Error intializing DB", error)
        process.exit(1) // status code 1 means failure, 0 success
    }
}

// Get one specific athlete; profile page
app.get("/api/athletes/:name", async (req, res) => {
    
    try {
        
        const{name} = req.params

        const athlete = await sql`
            SELECT * FROM athletes WHERE name = ${name}
        `

        res.status(200).json(athlete)

    } catch (error) {
        console.log("Error fetching athlete", error)
        res.status(500).json({message:"Internal server error"})
    }

})
// Get all athletes; Athlete dropdown
app.get("/api/athletes", async (req, res) => {
    
    try {

        const athletes = await sql`
            SELECT * FROM athletes ORDER BY name
        `

        res.status(200).json(athletes)

    } catch (error) {
        console.log("Error fetching athletes", error)
        res.status(500).json({message:"Internal server error"})
    }

})
// New athlete post
app.post("/api/athletes", async (req, res) => {

    // name, dob, gender, sport
    try {
        const {name, dob, gender, sport} = req.body

        if(!name || dob == undefined || !gender || !sport) {
            return res.status(400).json({message:"All fields required"})
        }

        const athlete = await sql`
            INSERT INTO athletes(name,dob,gender,sport)
            VALUES (${name},${dob},${gender},${sport})
            RETURNING *
        `

        console.log(athlete)
        res.status(201).json(athlete[0])

    } catch (error) {
        console.log("Error creating athlete", error)
        res.status(500).json({message:"Internal server error"})
    }

})

// Fetch all data for one specific athlete; charts
app.get("/api/data/:name", async (req, res) => {

    try {
        const{name} = req.params
        
        const data = await sql`
            SELECT * FROM data WHERE athlete = ${name} ORDER BY created_at DESC
        `

        res.status(200).json(data)


    } catch (error) {
        console.log("Error fetching data", error)
        res.status(500).json({message:"Internal server error"})
    }

})
// Create summary of data for one specific athlete; profile page, maybe session entry?
app.get("/api/data/summary/:name", async (req, res) => {
    try {
        const {name} = req.params

        // Selects metric, measurement, and unit information
        // Uses a subquery to find the personal best for each metric.
        // Subquery uses a CASE statement to determine how the different metrics should be handled:
        //      using MIN when m.is_time is true (time-based metrics)
        //      using MAX when m.is_time is false (distance-based metrics)
        const personalBests = await sql`
            SELECT
                d.metric,
                d.measurement,
                m.units,
                m.is_time
            FROM
                data d
            JOIN
                metrics m ON d.metric = m.metric
            WHERE
                d.athlete=${name}
            AND
                d.measurement = (
                    SELECT
                        CASE
                            WHEN m.is_time = true THEN MIN(d2.measurement)
                            ELSE MAX(d2.measurement)
                        END
                    FROM
                        data d2
                    JOIN
                        metrics m2 ON d2.metric = m2.metric
                    WHERE
                        d2.athlete = ${name}
                        AND d2.metric = d.metric
                )
        `

        res.status(200).json({personalBests})


    } catch (error) {
        console.log("Error fetching summary", error)
        res.status(500).json({message:"Internal server error"})
    }
})
// Fetch all data; leaderboards
app.get("/api/data", async (req, res) => {
    
    try {

        // JOINs data table and athletes table on the athlete column,
        // WHERE show_on_leaderboard is set to true.
        const data = await sql`
            SELECT d.*
            FROM data d
            JOIN athletes a ON d.athlete = a.name
            WHERE a.show_on_leaderboard = true
        `

        res.status(200).json(data)

    } catch (error) {
        console.log("Error fetching data", error)
        res.status(500).json({message:"Internal server error"})
    }

})
// New data post
app.post("/api/data", async (req, res) => {

    // athlete, metric, measurement
    try {
        const {athlete, metric, measurement} = req.body

        if(!athlete || !metric || measurement === undefined) {
            return res.status(400).json({message:"All fields required"})
        }

        const data = await sql`
            INSERT INTO data(athlete, metric, measurement)
            VALUES(${athlete},${metric},${measurement})
            RETURNING *
        `

        console.log(data)
        res.status(201).json(data[0])

    } catch (error) {
        console.log("Error creating data", error)
        res.status(500).json({message:"Internal server error"})
    }

})
// Undo incorrect data
app.delete("/api/data/:id", async (req, res) => {

    try {
        const {id} = req.params

        if(isNaN(parseInt(id))){
            return res.status(400).json({message:"Invalid data entry id"})
        }

        const result = await sql`
            DELETE FROM data WHERE id = ${id} RETURNING *
        `

        if (result.length === 0) {
            return res.status(404).json({message:"Data not found"})
        }

        res.status(200).json({message:"Data deleted successfully"})

    } catch (error) {
        console.log("Error deleting data", error)
        res.status(500).json({message:"Internal server error"})
    }

})

// Fetch all metrics; metric dropdown
app.get("/api/metrics", async (req, res) => {
    
    try {

        const metrics = await sql`
            SELECT * FROM metrics
        `

        res.status(200).json(metrics)

    } catch (error) {
        console.log("Error fetching metrics", error)
        res.status(500).json({message:"Internal server error"})
    }

})
// New metric post
app.post("/api/metrics", async (req, res) => {
    
    try {

        const {metric, units, is_time} = req.body

        if(!metric || !units || is_time === null) {
            return res.status(400).json({message:"All fields required"})
        }

        const newMetric = await sql`
            INSERT INTO metrics(metric, units, is_time)
            VALUES(${metric},${units},${is_time})
            RETURNING *
        `

        console.log(newMetric)
        res.status(201).json(newMetric[0])

    } catch (error) {
        console.log("Error creating metric", error)
        res.status(500).json({message:"Internal server error"})
    }

})

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