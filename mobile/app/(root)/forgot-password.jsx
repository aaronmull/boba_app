// app/(root)/forgot-password.jsx
import { View, Text } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Image } from "expo-image"
import { styles } from '../../assets/styles/auth.styles'
import { ForgotPassword } from '../../components/ForgotPassword'
import { useRouter } from 'expo-router'

export default function ForgotPasswordPage() {
  const router = useRouter()

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={150}
    >
      <View style={styles.container}>
        <Image source={require("../../assets/images/boba.png")} style={styles.illustration}/>
        <Text style={styles.title}>Reset Password</Text>
        
        <ForgotPassword 
          onCancel={() => router.back()} 
          isStandalone={true}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}