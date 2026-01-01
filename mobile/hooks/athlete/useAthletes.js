import { useState, useEffect, useCallback } from "react";

const API_URL = "https://boba-app-api.onrender.com/api";

export function useAthletes(clerkUserId) {
  const [athletes, setAthletes] = useState([]);
  const [available, setAvailable] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAthletes = useCallback(async () => {
    const res = await fetch(`${API_URL}/athletes`);
    if (!res.ok) throw new Error("Failed to fetch athletes");
    return res.json();
  }, []);

  const fetchAvailable = useCallback(async () => {
    const res = await fetch(`${API_URL}/athletes/unlinked`);
    if (!res.ok) throw new Error("Failed to fetch available athletes");
    return res.json();
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!clerkUserId) return null;

    const res = await fetch(`${API_URL}/athletes/clerk/${clerkUserId}`);

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch user data");

    return res.json();
  }, [clerkUserId]);

  const loadAthletes = useCallback(async () => {
    setLoading(true);
    try {
      const [athletesData, availableData, userData] = await Promise.all([
        fetchAthletes(),
        fetchAvailable(),
        fetchUserData(),
      ]);

      setAthletes(athletesData);
      setAvailable(availableData);
      setUserData(userData);
    } catch (err) {
      console.error("Error loading athletes:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchAthletes, fetchAvailable, fetchUserData]);

  useEffect(() => {
    loadAthletes();
  }, [loadAthletes]);

  return {
    athletes,
    available,
    userData,
    loading,
    loadAthletes,
  };
}
