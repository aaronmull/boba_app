import { sql } from "../config/db.js"

export async function getDataForAthlete(req, res) {
    
    try {

        const{ clerkUserId } = req.params
        
        const data = await sql`
            SELECT d.*, m.metric, m.units
            FROM data d
            JOIN athletes a ON d.athlete_id = a.id
            JOIN metrics m ON d.metric_id = m.id
            WHERE a.clerk_user_id = ${clerkUserId}
            ORDER BY d.created_at DESC
        `;

        res.status(200).json(data)

    } catch (error) {
        console.log("Error fetching data for athlete", error)
        res.status(500).json({message:"Internal server error"})
    }

}

export async function getSummary(req, res) {
    try {
        const { clerkUserId } = req.params;

        const personalBests = await sql`
            SELECT DISTINCT ON (m.metric)
                m.metric,
                d.measurement,
                m.units,
                m.is_time,
                d.created_at AS pb_date
            FROM data d
            JOIN athletes a ON d.athlete_id = a.id
            JOIN metrics m ON d.metric_id = m.id
            WHERE a.clerk_user_id = ${clerkUserId}
            ORDER BY 
                m.metric,
                CASE WHEN m.is_time = true THEN d.measurement END ASC,
                CASE WHEN m.is_time = false THEN d.measurement END DESC,
                d.created_at DESC
        `;

        res.status(200).json({ personalBests });
    } catch (error) {
        console.log("Error fetching summary", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function getLeaderboardData(req, res) {

    try {

        // JOINs data table and athletes table on the athlete column,
        // WHERE show_on_leaderboard is set to true.
        const data = await sql`
            SELECT DISTINCT ON (a.id, m.metric)
                d.id,
                a.name,
                a.sport,
                m.metric,
                m.units,
                m.is_time,
                d.measurement,
                d.created_at
            FROM data d
            JOIN athletes a ON d.athlete_id = a.id
            JOIN metrics m ON d.metric_id = m.id
            WHERE a.show_on_leaderboard = true
            ORDER BY
                a.id,
                m.metric,
                CASE WHEN m.is_time = true THEN d.measurement END ASC,
                CASE WHEN m.is_time = false THEN d.measurement END DESC,
                d.created_at ASC
        `

        res.status(200).json(data)

    } catch (error) {
        console.log("Error fetching leaderboard data", error)
        res.status(500).json({message:"Internal server error"})
    }

}

export async function getAdminData(req, res) {
    try {
        const data = await sql`
            SELECT 
                d.*, 
                a.name AS athlete_name,
                a.clerk_user_id,
                m.metric,
                m.units,
                m.is_time
            FROM data d
            JOIN athletes a ON d.athlete_id = a.id
            JOIN metrics m ON d.metric_id = m.id
            ORDER BY d.created_at DESC
        `;

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching admin data", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function createData (req, res) {

    // athlete, metric, measurement
    try {
        const { athleteId, metricId, measurement} = req.body

        if(!athleteId || !metricId || measurement == null) {
            return res.status(400).json({message:"All fields required"})
        }

        const athlete = await sql`SELECT id FROM athletes WHERE id = ${athleteId}`;
        const metric = await sql`SELECT id FROM metrics WHERE id = ${metricId}`;
        if (!athlete.length || !metric.length) {
        return res.status(400).json({ message: "Invalid athlete or metric" });
        }


        const data = await sql`
            INSERT INTO data(athlete_id, metric_id, measurement)
            VALUES(${athleteId},${metricId},${measurement})
            RETURNING *
        `

        console.log(data)
        res.status(201).json(data[0])

    } catch (error) {
        console.log("Error creating data", error)
        res.status(500).json({message:"Internal server error"})
    }

}

export async function undoData (req, res) {

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

}