import { useState, useCallback } from "react";

export function useData(clerkUserId) {

    const API_URL = "https://boba-app-api.onrender.com/api"
    
    const [performances, setPerformances] = useState([])
    const [summary, setSummary] = useState([])
    const [metrics, setMetrics] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMetrics = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/metrics`)
            if (!res.ok) throw new Error("failed to fetch metrics")
            const data = await res.json()
            setMetrics(data)
        } catch (err) {
            console.error("Error fetching metrics: ", err)
        }
    }, [])

    const fetchData = useCallback(async () => {        
        try {
            const res = await fetch(`${API_URL}/data/athlete/${clerkUserId}`)
            if (!res.ok) throw new Error("Failed to fetch performances");
            const data = await res.json()
            setPerformances(data)
        } catch (err) {
            console.error("Error fetching data:", err)
        }
    }, [clerkUserId])

    const fetchSummary = useCallback(async () => {        
        try{
            const res = await fetch(`${API_URL}/data/summary/${clerkUserId}`)
            if (!res.ok) throw new Error("Failed to fetch summary");
            const data = await res.json()
            setSummary(data.personalBests)
        } catch (err) {
            console.error("Error fetching data:", err)
        }
    }, [clerkUserId])

    const loadData = useCallback(async () => {
        if(!clerkUserId) return

        setLoading(true)
        try {
            await Promise.all([fetchMetrics(), fetchData(), fetchSummary()])
        } catch (err) {
            console.error("Error fetching data:", err)
        } finally {
            setLoading(false)
        }
    }, [fetchData, fetchSummary, clerkUserId])

    return {performances, summary, metrics, loading, loadData}

}