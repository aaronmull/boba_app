import { neon } from "@neondatabase/serverless";
import "dotenv/config";

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
    try {
        // athletes table
        await sql`
            CREATE TABLE IF NOT EXISTS athletes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                dob DATE,
                gender VARCHAR(255) NOT NULL,
                sport VARCHAR(255) NOT NULL,
                clerk_user_id VARCHAR(255) UNIQUE, -- Linked after Clerk signup
                show_on_leaderboard BOOLEAN NOT NULL DEFAULT true, -- Global opt-in/out
                created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `;

        // users table

        // metrics table
        await sql`
            CREATE TABLE IF NOT EXISTS metrics (
                id SERIAL PRIMARY KEY,
                metric VARCHAR(255) NOT NULL,
                units VARCHAR(255) NOT NULL,
                is_time BOOLEAN NOT NULL
            )
        `;

        // data table (linked to athletes and metrics)
        await sql`
            CREATE TABLE IF NOT EXISTS data (
                id SERIAL PRIMARY KEY,
                athlete_id INT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
                metric_id INT NOT NULL REFERENCES metrics(id) ON DELETE CASCADE,
                measurement FLOAT NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `;

        // Leaderboard index for faster metric queries
        await sql`
            CREATE INDEX IF NOT EXISTS idx_leaderboard
            ON data(metric_id, measurement)
        `;

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing DB", error);
        process.exit(1); // status code 1 means failure
    }
}
