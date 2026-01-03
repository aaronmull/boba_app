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
            return res.status(400).json({ message: "clerkUserI is required" })
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

export async function checkIfLinked(req, res) {
    try {
        const { clerkUserId } = req.params
        if(!clerkUserId) return res.status(400).json({message:"All fields required"})
        const athlete = await sql`SELECT * FROM athletes WHERE clerk_user_id = ${clerkUserId}`
        if(athlete.length === 0) res.status(200).json({ "linked": false })
        res.status(200).json({ "linked": true, "athlete": athlete[0]})
    } catch (error) {
        console.error("Error fetching athlete by Clerk ID", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function getAvailableAthletes(req, res) {
    try {
        const athletes = await sql`
            SELECT id, name, sport, dob
            FROM athletes
            WHERE clerk_user_id IS NULL
        `
        res.status(200).json(athletes)
    } catch (error) {
        console.error("Error fetching available athletes", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function linkAthlete(req, res) {
    try {
        const {athleteId, dob, clerkUserId} = req.body

        if(!athleteId || !dob || !clerkUserId) {
            return res.status(400).json({ message:"All fields required" })
        }
        
        const athlete = await sql`
            SELECT id, name, dob, clerk_user_id
            FROM athletes
            WHERE id = ${athleteId}
        `

        if(athlete.length === 0) {
            return res.status(404).json({ message: "Athlete not found" })
        }

        const athleteData = athlete[0]

        if(athleteData.clerk_user_id !== null) {
            return res.status(409).json({ message: "Athlete is already linked to another account" })
        }

        if(athleteData.dob !== dob) {
            return res.status(403).json({ message: "Date of birth does not match" })
        }

        const existingLink = await sql`
            SELECT id FROM athletes WHERE clerk_user_id = ${clerkUserId}
        `

        if(existingLink.length > 0) {
            return res.status(409).json({ message: "This account is already linked to another athlete"})
        }

        const updatedAthlete = await sql`
            UPDATE athletes
            SET clerk_user_id = ${clerkUserId}
            WHERE id = ${athleteId}
            RETURNING *
        `

        res.status(200).json({
            message: "Account successfully linked",
            athlete: updatedAthlete[0]
        })

    } catch (error) {
        console.error("Error linking athlete", error)
        res.status(500).json({ message: "Internal server error" })
    }
}