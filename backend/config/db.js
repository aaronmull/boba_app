import {neon} from "@neondatabase/serverless";
import "dotenv/config";

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL)

export async function initDB(){
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