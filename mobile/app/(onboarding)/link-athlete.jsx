/**
 * How can I get the athlete object from available when the id does not correspond to the index?
 */
import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { useAthletes } from '../../hooks/athlete/useAthletes'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/charts.styles'
import { COLORS } from '../../constants/colors'
import { SignOutButton } from '../../components/SignOutButton'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker';

export default function LinkAthlete() {

  const { user } = useUser()
  const { available, userData, loading } = useAthletes(user?.id)
  if(userData !== null) return <Redirect href={"/"}/>

  // Athlete Picker States
  const [ selectedAthlete, setSelectedAthlete ] = useState(null)
  const [ selectedAthleteID, setSelectedAthleteID ] = useState(null)
  const [ open, setOpen ] = useState(false)

  // DOB Picker States
  const [ dob, setDob ] = useState(new Date(1598051730000))
  const onChange = (_, selectedDate) => {
    setDob(prev => selectedDate ?? prev)
  }

  if(loading) return <PageLoader />

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
          placeholder='Select an Athlete'
          placeholderStyle={{ color: 'grey', }}
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
          </>
        )}
      </View>

      {/* Link Athlete Button; begins birthdate authentication;
          Touchable Opacity with onChange function that checks birthdate equivalence
            If equivalent, call the linkAthlete route with the Athlete ID and Clerk ID
            Else, set athlete and birthdate back to default and give Alert that says that the birthdate was incorrect.
      */}

    </View>
  )
}