import { useState, useEffect } from "react";

export function useAthletes() {

    const API_URL = "http://localhost:5001/api"
    
    const [athletes, setAthletes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchAthletes() {
            try {
                
                const res = await fetch(`${API_URL}/athletes`)
                if (!res.ok) throw new Error("Failed to fetch athletes");
                const data = await res.json()
                setAthletes(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAthletes();
    }, [])

    return { athletes, loading, error }

}