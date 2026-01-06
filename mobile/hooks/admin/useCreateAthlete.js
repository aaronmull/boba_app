import { useState, useCallback } from "react";
import { API_URL } from "../../constants/api";

export function useCreateAthlete() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const createAthlete = useCallback(async ({name, dob, gender, sport}) => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`${API_URL}/athletes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    dob,
                    gender,
                    sport,
                }),
            })

            const data = await res.json()

            if(!res.ok) {
                throw new Error(data.message || "Failed to create athlete")
            }

            return data
        } catch(err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        createAthlete,
        loading,
        error,
    }
}