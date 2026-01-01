import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { useAthletes } from '../../hooks/athlete/useAthletes'

export default function LinkAthlete() {

  const { user } = useUser()
  const { athletes, available, userData, loading } = useAthletes(user?.id)
  if(userData !== null) return <Redirect href={"/"}/>

  console.log(available)

  return (
    <View>
      <Text>Linking</Text>
    </View>
  )
}