import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import SafeScreen from "@/components/SafeScreen"
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'


export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
        <SafeScreen>
          <GestureHandlerRootView>
            <Slot />
          </GestureHandlerRootView>
        </SafeScreen>
        <StatusBar style="inverted" />
    </ClerkProvider>
  )
}