//https://clerk.com/docs/expo/hooks/use-auth

import { Stack } from 'expo-router/stack'
import { useUser, useAuth } from "@clerk/clerk-expo"
import { Redirect, usePathname } from 'expo-router'
import { useEffect, useState } from 'react'

// const API_URL = "https://localhost:5001/api"
const API_URL = "https://boba-app-api.onrender.com/api"

export default function Layout() {

    const { isSignedIn } = useUser();
    const { userId, getToken, isLoaded } = useAuth();
    const [athleteLinked, setAthleteLinked] = useState(null)
    const pathname = usePathname();

    useEffect(() => {
        async function checkLink() {
            if (!isSignedIn || !userId) return;
        
            // console.log("Starting check for userId:", userId)

            try {
                const token = await getToken();
                // console.log('token retrieved')

                const res = await fetch(`${API_URL}/athletes/checkLink/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                // console.log('fetch went out, status:', res.status)

                if (res.ok) {
                    const data = await res.json()
                    setAthleteLinked(data.exists)
                } else {
                    setAthleteLinked(false)
                }

            } catch (error) {
                console.error('Error checking athlete link:', error)
                setAthleteLinked(false)
            }
        }

        checkLink()

    }, [userId])

    if (!isLoaded || (athleteLinked === null && isSignedIn)) return null;

    if (isSignedIn && athleteLinked === false && pathname !=="/link-athlete") {
        return <Redirect href='/link-athlete' />
    }

    // console.log('Rendering Stack - isSignedIn: ', isSignedIn, 'athleteLinked: ', athlete)
    return <Stack screenOptions={{ headerShown: false }}/>
}