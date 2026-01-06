import { Alert, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Redirect, useRouter } from 'expo-router'
import { useAthletes } from '../../hooks/athlete/useAthletes'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/charts.styles'
import { COLORS } from '../../constants/colors'
import { SignOutButton } from '../../components/SignOutButton'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather, Foundation, Ionicons } from '@expo/vector-icons'
import { useLinkAthlete } from '../../hooks/athlete/useLinkAthlete'
import { LeaderboardToggleLinking } from '../../components/LeaderboardToggleLinking'
import { useLeaderboardPreference } from '../../hooks/athlete/useLeaderboardPreference'

export default function LinkAthlete() {

  const { user, isLoaded } = useUser()
  const { available, userData, loading } = useAthletes(user?.id)
  const { linkAthlete, loading: linking } = useLinkAthlete()
  const { updatePreference } = useLeaderboardPreference()
  const router = useRouter()

  // Athlete Picker States
  const [ selectedAthleteID, setSelectedAthleteID ] = useState(null)
  const [ open, setOpen ] = useState(false)

  // DOB Picker States
  const [ dob, setDob ] = useState(new Date(1598051730000))

  // Show on Leaderboard States
  const [ showOnLeaderboard, setShowOnLeaderboard ] = useState(false)

  const formatDate = (date) =>
    new Date(date).toISOString().split("T")[0]

  const onChange = (_, selectedDate) => {
    setDob(prev => selectedDate ?? prev)
  }

  const onPress = async () => {
    try {
      const athlete = available.find(a => a.id === selectedAthleteID)
      if(!athlete) return

      const formattedDOB = formatDate(dob)

      await linkAthlete({
        athleteId: athlete.id,
        dob: formattedDOB,
        clerkUserId: user.id,
      })

      await updatePreference({
        clerkUserId: user.id,
        showOnLeaderboard: showOnLeaderboard,
      })

      Alert.alert(
        "Account successfully linked!",
        "Your account has been linked to your athlete profile.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/"),
          },
        ]
      )
    } catch (err) {
      Alert.alert(err.message)
      setSelectedAthleteID(null)
      setDob(new Date(1598051730000))
    }
  }

  if(loading || !isLoaded) return <PageLoader />
  if(userData !== null) return <Redirect href={"/"}/>

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SignOutButton />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Link your Account to your Name</Text>
        </View>
      </View>

      {/* Pickers */}
      <View style={styles.pickerCard}>
        {/* Athlete Picker */}
        <Text style={styles.sectionTitle}>Athlete</Text>
        <DropDownPicker 
          open={open}
          setOpen={setOpen}
          value={selectedAthleteID}
          setValue={setSelectedAthleteID}
          items={available.map(a => ({
            label: a.name,
            value: a.id,
          }))}
          maxHeight={200}
          zIndex={3000}
          containerStyle={styles.pickerContainer}
          style={{
              borderColor: COLORS.border,
          }}
          textStyle={{
              color: COLORS.text,
              fontSize: 16,
              paddingLeft: 4,
          }}
          dropDownContainerStyle={{
              borderColor: COLORS.border,
          }}
          searchTextInputStyle={{
              borderColor: COLORS.border,
          }}
          searchContainerStyle={{
              borderBottomColor: COLORS.border,
          }}
          placeholderStyle={{ color: "#9A8478", }}
          placeholder='Select an Athlete'
          searchable={true}
          searchPlaceholder='Search for an Athlete'
          listMode="SCROLLVIEW"
        />
        {/* DOB Picker */}
        {selectedAthleteID && (
          <>
            <Text style={styles.sectionTitle}>Date of Birth</Text>
            <DateTimePicker
              value={dob}
              mode="date"
              display='spinner'
              textColor={COLORS.other}
              onChange={onChange}
            />
            <LeaderboardToggleLinking 
              value={showOnLeaderboard}
              onValueChange={setShowOnLeaderboard}
              disabled={linking}
            />
          </>
        )}
      </View>

      {selectedAthleteID && (
        <>
          <View style={styles.buttonView}>
            <TouchableOpacity style={[styles.addButton, linking && { opacity: 0.6 }]} disabled={linking} onPress={onPress}>
              <Feather name="link" size={22} color={COLORS.white} />
              <Text style={styles.addButtonText}> Link Account</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

    </View>
  )
}