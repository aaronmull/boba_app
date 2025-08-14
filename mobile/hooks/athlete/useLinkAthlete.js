import { useState } from "react";

export function useLinkAthlete() {

    const API_URL = "https://boba-app-api.onrender.com/api"

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    async function linkAthlete(athleteId, clerkUserId) {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const res = await fetch(`${API_URL}/athletes/link`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ athleteId, clerkUserId }),
            })
            if (!res.ok) throw new Error("Failed to link athlete");
            setSuccess(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { linkAthlete, loading, error, success}

}