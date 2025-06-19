import express from "express"
import { getAthleteByName, getAllAthletes, createAthlete  } from "../controllers/athletesController.js"


const router = express.Router()

// Get one specific athlete; profile page
router.get("/:name", getAthleteByName)

// Get all athletes; Athlete dropdown
router.get("/", getAllAthletes)

// New athlete post
router.post("/", createAthlete)

export default router