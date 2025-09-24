import { useState, useEffect } from "react";

export function useMetrics() {
    
    const API_URL = "https://boba-app-api.onrender.com/api"

    const [metrics, setMetrics] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const res = await fetch(`${API_URL}/metrics`)
                if (!res.ok) throw new Error("failed to fetch metrics")
                const data = await res.json()
                setMetrics(data)
            } catch (err) {
                console.error("Error fetching metrics: ", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchMetrics()
    }, [])

    return {metrics, loading, error}
}