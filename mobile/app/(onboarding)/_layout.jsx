import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import PageLoader from '../../components/PageLoader'

export default function OnboardingLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return <PageLoader />
  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  return <Stack screenOptions={{headerShown: false}}/>
}