import { sql } from "../config/db.js"


export async function getAthleteByName(req, res) {
    
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

}

export async function getAthleteByClerkId(req, res) {

    try {

        const { clerkUserId } = req.params

        if (!clerkUserId) {
            return res.status(400).json({ message: "clerkUserId is required" })
        }

        const athlete = await sql`
            SELECT * FROM athletes WHERE clerk_user_id = ${clerkUserId}
        `;

        if (athlete.length === 0) {
            return res.status(404).json({ message: "Athlete not found" })
        }

        res.status(200).json(athlete[0])

    } catch (error) {
        console.error("Error fetching athlete by Clerk ID", error)
        res.status(500).json({ message: "Internal server error" })
    }

}

export async function getAllAthletes(req, res) {
    
    try {
    
        const athletes = await sql`
            SELECT * FROM athletes ORDER BY name
        `

        res.status(200).json(athletes)

    } catch (error) {
        console.log("Error fetching athletes", error)
        res.status(500).json({message:"Internal server error"})
    }

}

export async function linkAthleteAccount(req, res) {

    try {
        
        const { athleteId } = req.body;
        const clerkUserId = req.auth.userId;

        if (!athleteId) {
            return res.status(400).json({ message: "athleteId is required"})
        }

        const updatedAthlete = await sql`
            UPDATE athletes
            SET clerk_user_id = ${clerkUserId}
            WHERE id = ${athleteId}
            RETURNING *
        `;

        if (updatedAthlete.length === 0) {
            return res.status(404).json({ message: "Athlete not found" })
        }

        res.status(200).json(updatedAthlete[0])

    } catch (error) {

        console.error("Error linking athlete account", error)
        res.status(500).json({ message: "Internal server error" })

    }

}

export async function createAthlete(req, res) {

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

}

export async function checkClerkLink(req, res) {

    try {

        const {clerkUserId } = req.params

        if(!clerkUserId) {
            return res.status(400).json({ message: "clerkUserId is required" })
        }

        const athlete = await sql`
            SELECT EXISTS(SELECT 1 FROM athletes WHERE clerk_user_id = ${clerkUserId}) as exists
        `

        const exists = athlete[0].exists;

        res.status(200).json({
            exists: exists,
            clerkUserId: clerkUserId,
        })

    } catch (error) {
        console.log("Error checking for Clerk ID", error)
        res.status(500).json({message:"Internal server error"})
    }

}