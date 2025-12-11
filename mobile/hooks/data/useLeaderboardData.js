import { useState, useEffect } from "react";

export function useLeaderboardData() {
    
    const API_URL = "https://boba-app-api.onrender.com/api"

    const [leaderboardData, setLeaderboardData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchLeaderboardData() {
            try {
                const res = await fetch(`${API_URL}/data/leaderboards`)
                if (!res.ok) throw new Error("Failed to fetch leaderboard data")
                const data = await res.json()
                setLeaderboardData(data)
            } catch (err) {
                console.error("Error fetching leaderboard data: ", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchLeaderboardData()
    }, [])

    return {leaderboardData, loading, error}
}