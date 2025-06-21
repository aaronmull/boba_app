import express from "express"
import { getDataForAthlete, getSummary, getAllData, createData, undoData } from "../controllers/dataController.js"

const router = express.Router()

// Fetch all data for one specific athlete; charts
router.get("/:name", getDataForAthlete)

// Create summary of data for one specific athlete; profile page, maybe session entry?
router.get("/summary/:name", getSummary)

// Fetch all data; leaderboards
router.get("/", getAllData)

// New data post
router.post("/", createData)

// Undo incorrect data
router.delete("/:id", undoData)

export default router