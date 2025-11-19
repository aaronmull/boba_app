import { useState, useEffect } from "react";

export function useAdmin() {

    const API_URL = "https://boba-app-api.onrender.com/api"

    const [allData, setAllData] = useState([])
    const [loading, setLoading] = useState(true)

    async function loadAdminData() {
        try {
            const res = await fetch(`${API_URL}/data/admin`)
            if(!res.ok) throw new Error("Failed to fetch admin data")
            const data = await res.json()
            setAllData(data)
        } catch (err) {
            console.error("Error fetching admin data:", err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        loadAdminData()
    }, [])

    return {allData, loading, loadAdminData}
}