import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { useLeaderboardData } from '../../hooks/data/useLeaderboardData'
import { useAthletes } from '../../hooks/athlete/useAthletes'
import PageLoader from '../../components/PageLoader'
import { useMetrics } from '../../hooks/metrics/useMetrics'
import { useSports } from '../../hooks/sports/useSports'
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../../assets/styles/leaderboard.styles'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import { getAge } from '../../lib/utils'

export default function LeaderboardScreen() {
  const { user } = useUser()
  const router = useRouter()
  const { leaderboardData, loading: loadingLeaderboard, error: dataError } = useLeaderboardData()
  const { athletes, userData, loading: loadingAthletes, loadAthletes } = useAthletes(user.id)
  const { metrics, loading: loadingMetrics, error: metricsError } = useMetrics()
  const { sports, loading: loadingSports, error: sportsError, loadSports } = useSports()

  const [ metric, setMetric ] = useState(null)
  const [ sport, setSport ] = useState([])
  const [ ageRange, setAgeRange ] = useState(null)
  const [ gender, setGender ] = useState([])

  const [ refreshing, setRefreshing ] = useState(false)

  // Dropdown Pickers
  const [ metricOpen, setMetricOpen ] = useState(false)
  const [ sportOpen, setSportOpen ] = useState(false)
  const [ ageOpen, setAgeOpen ] = useState(false)
  const [ genderOpen, setGenderOpen] = useState(false)

  const handleMetricChange = (itemValue, itemIndex) => setMetric(itemValue)
  const handleSportChange = (itemValue, itemIndex) => setSport(itemValue)
  const handleAgeChange = (itemValue, itemIndex) => setAgeRange(itemValue)
  const handleGenderChange = (itemValue, itemIndex) => setGender(itemValue)

  const onMetricOpen = useCallback(() => {
    setSportOpen(false)
    setAgeOpen(false)
    setGenderOpen(false)
  }, [])
  const onSportOpen = useCallback(() => {
    setMetricOpen(false)
    setAgeOpen(false)
    setGenderOpen(false)
  }, [])
  const onAgeOpen = useCallback(() => {
    setMetricOpen(false)
    setSportOpen(false)
    setGenderOpen(false)
  }, [])
  const onGenderOpen = useCallback(() => {
    setMetricOpen(false)
    setSportOpen(false)
    setAgeOpen(false)
  }, [])

  const ageRanges = [
    { label: "Middle School (12-14)", value: "middle" },
    { label: "High School (15-18)", value: "high"},
    { label: "College & Older (19+)", value: "college" },
  ]

  function athleteInAgeRange(athlete, ageRange) {
    const age = getAge(athlete.dob)
    if(age < 12) return false;
    switch (ageRange) {
      case "middle":
        return age >= 12 && age <= 14;
      case "high":
        return age >= 15 && age <= 18;
      case "college":
        return age >= 19;
      default:
        return true;
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([loadAthletes(), loadSports()])
    setRefreshing(false)
  }
  if(loadingLeaderboard || loadingAthletes || loadingMetrics || loadingSports) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        {/* Fix the styles to make title centered without tabs. Maybe add an export button? */}
        <Text style={styles.headerTitle}>Leaderboards                            </Text>
      </View>
      <ScrollView>
        <View style={styles.pickerCard}>
          <Text style={styles.sectionTitle}>Metric</Text>
          <DropDownPicker 
            open={metricOpen}
            onOpen={onMetricOpen}
            setOpen={setMetricOpen}
            value={metric}
            setValue={setMetric}
            items={metrics.map(m => ({
              label: m.metric,
              value: m.metric,
            }))}
            maxHeight={200}
            zIndex={3000}
            zIndexInverse={1000}
            containerStyle={styles.pickerContainer}
            placeholder='Select a Metric'
            placeholderStyle={{ color: 'grey', }}
            searchable={true}
            searchPlaceholder='Search for a Metric'
            listMode="SCROLLVIEW"
          />
          <Text style={styles.sectionTitle}>Sport</Text>
          <DropDownPicker 
            open={sportOpen}
            onOpen={onSportOpen}
            setOpen={setSportOpen}
            value={sport}
            setValue={setSport}
            items={sports.map(s => ({
              label: s.sport,
              value: s.sport,
            }))}
            maxHeight={200}
            zIndex={2000}
            zIndexInverse={2000}
            containerStyle={styles.pickerContainer}
            placeholder='Select Sport(s)'
            placeholderStyle={{ color: 'grey', }}
            searchable={true}
            searchPlaceholder='Search for a Sport'
            multiple={true}
            min={0}
            max={20}
            mode="BADGE"
            showBadgeDot={false}
            multipleText="%d selected"
            badgeTextStyle={{ fontSize: 14 }}
            badgeStyle={{
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
            extendableBadgeContainer={true}
            listMode="SCROLLVIEW"
          />
          <Text style={styles.sectionTitle}>Gender</Text>
          <DropDownPicker 
            open={genderOpen}
            onOpen={onGenderOpen}
            setOpen={setGenderOpen}
            value={gender}
            setValue={setGender}
            items={[
              {label: "Male", value: "Male"},
              {label: "Female", value: "Female"},
            ]}
            maxHeight={200}
            zIndex={1500}
            zIndexInverse={1500}
            containerStyle={styles.pickerContainer}
            placeholder='Select Gender(s)'
            placeholderStyle={{ color: "grey", }}
            searchable={false}
            multiple={true}
            min={0}
            max={2}
            mode="BADGE"
            showBadgeDot={false}
            multipleText="%d selected"
            badgeTextStyle={{ fontSize: 14 }}
            badgeStyle={{
              backgroundColor: COLORS.primary,
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
            listMode='SCROLLVIEW'
          />
          <Text style={styles.sectionTitle}>Age Range</Text>
          <DropDownPicker 
            open={ageOpen}
            onOpen={onAgeOpen}
            setOpen={setAgeOpen}
            value={ageRange}
            setValue={setAgeRange}
            items={ageRanges}
            maxHeight={200}
            zIndex={1400}
            zIndexInverse={1400}
            containerStyle={styles.pickerContainer}
            placeholder='Select Age Range'
            placeholderStyle={{ color: "grey" }}
            searchable={false}
            listMode='SCROLLVIEW'
            multiple={false}
          />
        </View>
      </ScrollView>
    </View>
  )
}