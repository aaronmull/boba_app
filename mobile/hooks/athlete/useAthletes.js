import { useState, useEffect, useCallback } from "react";

export function useAthletes(clerkUserId) {

    const API_URL = "https://boba-app-api.onrender.com/api"
    
    const [athletes, setAthletes] = useState([])
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchAthletes = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/athletes`)
            if (!res.ok) throw new Error("Failed to fetch athletes");
            const data = await res.json()
            setAthletes(data);
        } catch (err) {
            console.error("Error fetching athletes:", err)
        }
    }, [])

    const fetchUserData = useCallback(async () => {
        if(!clerkUserId) return;
        try {
            const res = await fetch(`${API_URL}/athletes/clerk/${clerkUserId}`)
            if (!res.ok) throw new Error("Failed to fetch user name");
            const data = await res.json()
            setUserData(data)
        } catch (err) {
            console.error("Error fetching user data:", err)
        }
    }, [clerkUserId])

    const loadAthletes = useCallback(async () => {        
        setLoading(true)
        try {
            await Promise.all([fetchAthletes(), fetchUserData()])
        } catch (err) {
            console.error("Error loading athletes:", err)
        } finally {
            setLoading(false)
        }
    }, [fetchAthletes, fetchUserData])

    useEffect(() => {
        loadAthletes();
    }, [loadAthletes])
    

    return { athletes, userData, loading, loadAthletes }

}