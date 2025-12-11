import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";

export const useSports = () => {
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadSports = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/sports`);
            if (!response.ok) throw new Error("Failed to fetch sports");

            const data = await response.json();

            const normalized = data.map((item, index) => ({
                id: item.id,
                sport: item.sport,
            }));

            setSports(normalized);
        } catch (err) {
            console.error("Error loading sports:", err);
            setError(err.message || "Failed to load sports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSports();
    }, []);

    return { sports, loading, error, loadSports };
}