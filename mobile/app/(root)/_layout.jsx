import { Stack } from 'expo-router/stack'
import { useUser } from "@clerk/clerk-expo"
import { Redirect } from 'expo-router'
import { useAthletes } from '../../hooks/athlete/useAthletes';
import PageLoader from '../../components/PageLoader';

export default function Layout() {
    const { isSignedIn, isLoaded, user } = useUser();
    const { userData, loading } = useAthletes(user?.id)

    // Better UX
    if (!isLoaded || loading) return <PageLoader />;
    if (!isSignedIn) return <Redirect href={"/sign-in"} />;
    if (isSignedIn && !userData) return <Redirect href={"/link-athlete"} />

    return ( 
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="create" />
            <Stack.Screen name="charts" />
            <Stack.Screen name="leaderboards" />
            <Stack.Screen name="settings" />
        </Stack>
    )
}