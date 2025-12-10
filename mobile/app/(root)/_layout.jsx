import { Stack } from 'expo-router/stack'
import { useUser } from "@clerk/clerk-expo"
import { Redirect } from 'expo-router'

export default function Layout() {
    const { isSignedIn, isLoaded } = useUser();

    // Better UX
    if (!isLoaded) return null;
    if (!isSignedIn) return <Redirect href={"/sign-in"} />;

    return ( 
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="create" />
            <Stack.Screen name="charts" />
            <Stack.Screen name="leaderboards" />
        </Stack>
    )
}