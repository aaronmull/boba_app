// components/ForgotPassword.jsx
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../assets/styles/auth.styles'
import { COLORS } from '../constants/colors'

export function ForgotPassword({ onCancel }) {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pendingReset, setPendingReset] = useState(false)
  const [error, setError] = useState('')

  // Send password reset code to user's email
  const onSendResetCode = async () => {
    if (!isLoaded) return
    setError('')

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      })
      
      setPendingReset(true)
      Alert.alert('Success', 'Password reset code sent to your email')
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Failed to send reset code')
    }
  }

  // Reset the password with the code
  const onResetPassword = async () => {
    if (!isLoaded) return
    setError('')

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        Alert.alert('Success', 'Password reset successfully!')
        router.replace('/')
      } else {
        console.error(JSON.stringify(result, null, 2))
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Failed to reset password')
    }
  }

  // Cancel forgot password flow
  const handleCancel = () => {
    setPendingReset(false)
    setCode('')
    setNewPassword('')
    setEmailAddress('')
    setError('')
    if (onCancel) onCancel()
  }

  if (!isLoaded) {
    return null
  }

  return (
    <View>
      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError('')}>
            <Ionicons name="close" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      ) : null}

      {!pendingReset ? (
        // Step 1: Enter email to receive reset code
        <>
          <Text style={styles.subtitle}>Enter your email address to receive a password reset code</Text>
          
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            autoCapitalize="none"
            value={emailAddress}
            placeholderTextColor='#9A8478'
            placeholder="Enter email"
            onChangeText={setEmailAddress}
          />

          <TouchableOpacity style={styles.button} onPress={onSendResetCode}>
            <Text style={styles.buttonText}>Send Reset Code</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCancel} style={{ marginTop: 16 }}>
            <Text style={styles.linkText}>Back to Sign In</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Step 2: Enter code and new password
        <>
          <Text style={styles.subtitle}>Enter the code sent to your email and your new password</Text>
          
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            value={code}
            placeholderTextColor='#9A8478'
            placeholder="Reset code"
            onChangeText={setCode}
          />

          <TextInput
            style={[styles.input, error && styles.errorInput]}
            value={newPassword}
            placeholderTextColor='#9A8478'
            placeholder="New password"
            secureTextEntry={true}
            onChangeText={setNewPassword}
          />

          <TouchableOpacity style={styles.button} onPress={onResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCancel} style={{ marginTop: 16 }}>
            <Text style={styles.linkText}>Back to Sign In</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}