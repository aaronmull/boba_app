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