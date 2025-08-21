//https://clerk.com/docs/expo/hooks/use-auth

import { Stack } from 'expo-router/stack'
import { useUser, useAuth } from "@clerk/clerk-expo"
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'

const API_URL = "https://boba-app-api.onrender.com/api"

export default function Layout() {

    const { isSignedIn, user } = useUser();
    const { userId, getToken, isLoaded } = useAuth();
    const [athleteLinked, setAthleteLinked] = useState(null)
    
    useEffect(() => {
        async function checkLink() {
            if (!isSignedIn) return;

            const token = await getToken();
            const res = await fetch(`${API_URL}/athletes/checkLink/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            // LOOK AT CLAUDE TO FINISH

            // create a route/query or whatever that searches if a specific userId exists in its respective column in the athletes table. If it does not, redirect them 
            // to a link athlete page. If it does, continue to the home page that will have their summary.

        }
    }, [isSignedIn])

    return <Stack screenOptions={{ headerShown: false }}/>
}