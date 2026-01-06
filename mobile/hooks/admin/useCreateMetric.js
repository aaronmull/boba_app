import { useCallback, useState } from "react";
import { API_URL } from "../../constants/api";

export function useCreateMetric() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const createMetric = useCallback(async ({metric, units, isTime}) => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`${API_URL}/metrics`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    metric,
                    units,
                    isTime,
                }),
            })

            const data = await res.json()

            if(!res.ok) {
                throw new Error(data.message || "Failed to create metric")
            }

            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, []) 

    return {
        createMetric,
        loading,
        error,
    }
}