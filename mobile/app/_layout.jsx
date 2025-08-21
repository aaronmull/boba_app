import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { Slot, useRouter, useSegments } from 'expo-router'
import SafeScreen from "@/components/SafeScreen"
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { useEffect } from 'react'

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments();
  const router = useRouter()

  useEffect(() => {

    if (!isLoaded) return;

    const inTabsGroup = segments[0] === '(auth)'

    if (isSignedIn && !inTabsGroup) {
      router.replace('/home')
    } else if (!isSignedIn) {
      router.replace('/sign-in')
    }

    console.log('isSignedIn', isSignedIn)

  }, [isSignedIn])


  return <Slot />
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <SafeScreen>
            <InitialLayout />
        </SafeScreen>
    </ClerkProvider>
  )
}