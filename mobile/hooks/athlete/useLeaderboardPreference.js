import { useState, useCallback } from "react"
import { API_URL } from "../../constants/api"

export function useLeaderboardPreference() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updatePreference = useCallback(async ({ clerkUserId, showOnLeaderboard }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/athletes/leaderboard`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId,
          showOnLeaderboard,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to update preference")
      }

      return await res.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    updatePreference,
    loading,
    error,
  }
}
