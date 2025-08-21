//https://clerk.com/docs/expo/hooks/use-auth

import { Stack } from 'expo-router/stack'
import { useUser, useAuth } from "@clerk/clerk-expo"
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'

const API_URL = "https://boba-app-api.onrender.com/api"

export default function Layout() {
    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const [athleteLinked, setAthleteLinked] = useState(null)

    // useEffect(() => {
    //     async function checkLink() {
    //         if (!isSignedIn) return;

    //         const token = await getToken({ template: "default" });
    //         const res = await fetch(`${API_URL}/user/$`)
    //     }
    // }, [isSignedIn])

    if (!isSignedIn) return <Redirect href={"/sign-in"} />;

    return <Stack screenOptions={{ headerShown: false }}/>
}