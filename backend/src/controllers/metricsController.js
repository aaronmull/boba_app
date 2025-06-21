import { sql } from "../config/db.js"

export async function getAllMetrics(req, res) {
    
    try {

        const metrics = await sql`
            SELECT * FROM metrics
        `

        res.status(200).json(metrics)

    } catch (error) {
        console.log("Error fetching metrics", error)
        res.status(500).json({message:"Internal server error"})
    }

}

export async function createMetric(req, res) {
    
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

}