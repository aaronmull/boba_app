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

// SPECIFIC ROUTES FIRST (before any :params)
// Get list of athletes that have no Clerk ID
router.get("/unlinked", getAvailableAthletes)

// Check if the user's Clerk ID is already linked
router.get("/by-clerk/:clerkUserId", checkIfLinked)

// Get one specific athlete by their Clerk ID
router.get("/clerk/:clerkUserId", getAthleteByClerkId)

// Link athlete
router.post("/link", linkAthlete)

// PARAMETERIZED ROUTES LAST
// Get one specific athlete; profile page
router.get("/:name", getAthleteByName)

// Get all athletes; Athlete dropdown
router.get("/", getAllAthletes)

// New athlete post
router.post("/", createAthlete)

export default router