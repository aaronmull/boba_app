import { useState, useEffect } from "react";

export function useSummary(clerkUserId) {

    const API_URL = "https://boba-app-api.onrender.com/api"

    const[summary, setSummary] = useState([])
    const[loading, setLoading] = useState(true)
    const[error, setError] = useState(false)

    useEffect(() => {

        if (!clerkUserId) return;
        
        async function fetchSummary() {
            try{
                const res = await fetch(`${API_URL}/data/summary/${clerkUserId}`)
                if (!res.ok) throw new Error("Failed to fetch summary");
                const data = await res.json()
                setSummary(data.personalBests)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchSummary()
    }, [clerkUserId])

    return { summary, loading, error}

}