import { useState, useCallback } from "react"
import { API_URL } from "../../constants/api"

export function useLinkAthlete() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const linkAthlete = useCallback(async ({ athleteId, dob, clerkUserId }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/athletes/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          athleteId,
          dob,     
          clerkUserId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to link athlete")
      }

      return data // { message, athlete }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    linkAthlete,
    loading,
    error,
  }
}
