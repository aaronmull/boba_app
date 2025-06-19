import express from "express"
import { getAllMetrics, createMetric } from "../controllers/metricsController.js"

const router = express.Router()

// Fetch all metrics; metric dropdown
router.get("/", getAllMetrics)

// New metric post
router.post("/", createMetric)

export default router