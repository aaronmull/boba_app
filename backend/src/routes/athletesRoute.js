import express from "express"
import { 
    getAthleteByName,
    getAthleteByClerkId, 
    getAllAthletes, 
    createAthlete,
    checkIfLinked,
    getAvailableAthletes,  
    linkAthlete } from "../controllers/athletesController.js"


const router = express.Router()

// Get one specific athlete by their Clerk ID
router.get("/clerk/:clerkUserId", getAthleteByClerkId)

// Get one specific athlete; profile page
router.get("/:name", getAthleteByName)

// Get all athletes; Athlete dropdown
router.get("/", getAllAthletes)

// New athlete post
router.post("/", createAthlete)

// Check if the user's Clerk ID is already linked
router.get("/by-clerk/:clerkUserId", checkIfLinked)

// Get list of athletes that have no Clerk ID
router.get("/unlinked", getAvailableAthletes)

router.post("/link", linkAthlete)

export default router