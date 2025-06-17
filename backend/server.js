import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5001

async function initDB(){
    try {
        await sql`CREATE TABLE IF NOT EXISTS athletes(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            age VARCHAR(255) NOT NULL,
            gender VARCHAR(255) NOT NULL,
            sport VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("Database initialized successfully")
    } catch (error) {
        console.log("Error intializing DB", error)
        process.exit(1) // status code 1 means failure, 0 success
    }
}

app.get("/", (req, res) => {
    res.send("It's working");
});

initDB().then(() => {
    app.listen(PORT ,() => {
        console.log("Server is running on PORT:", PORT);
    })
})