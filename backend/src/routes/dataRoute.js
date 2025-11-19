import express from "express"
import { 
    getDataForAthlete,
    getSummary,
    getLeaderboardData,
    getAdminData, 
    createData, 
    undoData } from "../controllers/dataController.js"

const router = express.Router()

// Fetch all data for one specific athlete; charts
router.get("/athlete/:clerkUserId", getDataForAthlete)

// Create summary of data for one specific athlete; profile page, maybe session entry?
router.get("/summary/:clerkUserId", getSummary)

// Fetch all data to be shown on leaderboards
router.get("/leaderboards", getLeaderboardData)

// Fetch all data to be shown on Coach homepage
router.get("/admin", getAdminData)

// New data post
router.post("/", createData)

// Undo incorrect data
router.delete("/:id", undoData)

export default router