import express from "express"
import { 
    getAthleteByName,
    getAthleteByClerkId, 
    getAllAthletes, 
    createAthlete, 
    linkAthleteAccount  } from "../controllers/athletesController.js"


const router = express.Router()

// Get one specific athlete; profile page
router.get("/:name", getAthleteByName)

// Get one specific athlete by their Clerk ID
router.get("/clerk:clerkUserId", getAthleteByClerkId)

// Get all athletes; Athlete dropdown
router.get("/", getAllAthletes)

// New athlete post
router.post("/", createAthlete)

// Link Clerk ID
router.patch("/link", linkAthleteAccount)

export default router