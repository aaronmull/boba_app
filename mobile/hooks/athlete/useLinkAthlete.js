import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

export function useLinkAthlete() {

    const API_URL = "https://boba-app-api.onrender.com/api"

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const { getToken } = useAuth();

    async function linkAthlete(athleteId) {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {

            const token = await getToken({ template: "default"})
            if(!token) throw new Error("Authentication required");
            
            const res = await fetch(`${API_URL}/athletes/link`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ athleteId }),
            })
            if (!res.ok) throw new Error("Failed to link athlete");

            const data = await res.json();
            setSuccess(true)
            return data;

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setError(null);
        setSuccess(false);
    }

    return { linkAthlete, loading, error, success, reset}

}