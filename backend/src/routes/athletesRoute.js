import express from "express"
import { requireAuth } from "@clerk/express"
import { 
    getAthleteByName,
    getAthleteByClerkId, 
    getAllAthletes, 
    createAthlete, 
    linkAthleteAccount  
} from "../controllers/athletesController.js"


const router = express.Router()

// Get one specific athlete by their Clerk ID
router.get("/clerk/:clerkUserId", getAthleteByClerkId)

// Get one specific athlete; profile page
router.get("/:name", getAthleteByName)

// Get all athletes; Athlete dropdown
router.get("/", getAllAthletes)

// New athlete post
router.post("/", createAthlete)

// Link Clerk ID
router.patch("/link", requireAuth(), linkAthleteAccount)

export default router