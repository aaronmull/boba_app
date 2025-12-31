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
import LeaderboardList from '../../components/LeaderboardList'
import { Feather } from '@expo/vector-icons'

export default function LeaderboardScreen() {
  const { user } = useUser()
  const router = useRouter()
  const { leaderboardData, loading: loadingLeaderboard, error: dataError } = useLeaderboardData()
  const { metrics, loading: loadingMetrics, error: metricsError } = useMetrics()
  const { sports, loading: loadingSports, error: sportsError, loadSports } = useSports()

  const [ metric, setMetric ] = useState(null)
  const [ sport, setSport ] = useState([])
  const [ ageRange, setAgeRange ] = useState(null)
  const [ gender, setGender ] = useState([])

  // Dropdown Pickers
  const [dropdownOpen, setDropdownOpen] = useState({
    metric: false,
    sport: false,
    age: false,
    gender: false,
  })

  const closeAll = () =>
    setDropdownOpen({metric: false, sport: false, age: false, gender: false, })

  const openDropdown = name => {
    closeAll()
    setDropdownOpen(prev => ({ ...prev, [name]: true}))
  }

  const handleSetOpen = (name) => (shouldOpen) => {
    if(shouldOpen) {
      openDropdown(name)
    } else {
      setDropdownOpen(prev => ({ ...prev, [name]: false }))
    }
  }

  const ageRanges = [
    { label: "Middle School (11-14)", value: "middle" },
    { label: "High School (13-19)", value: "high"},
    { label: "College & Older (17+)", value: "college" },
  ]

  function athleteInAgeRange(athlete, range) {
    const age = getAge(athlete.dob)
    if(age < 12) return false;
    if(range === "middle")  return age >= 11 && age <= 14
    if(range === "high")    return age >= 13 && age <= 19
    if(range === "college") return age >= 17
    return true;
  }

  // Filter leaderboard data to match the filters the user selects
  const filteredData = leaderboardData
    // filter based on metric
    .filter(entry => !metric || entry.metric === metric)
    // filter based on sport
    .filter(entry => sport.length === 0 || sport.includes(entry.sport))
    // filter based on gender
    .filter(entry => gender.length === 0 || gender.includes(entry.gender))
    // filter based on dob
    .filter(entry => !ageRange || athleteInAgeRange(entry, ageRange))

  const sortLeaderboard = (data) => {
    return [...data].sort((a, b) => {
      if (a.is_time) return a.measurement - b.measurement
      return b.measurement - a.measurement
    })
  }

  const formatPerformance = (item) => {
    if(item.units === "in") {
      if(item.metric === "Vertical Jump") return `${item.measurement}"`
      const totalInches = Number(item.measurement);
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}' ${inches}"`;
    }
    if (item.units === "s") {
      return `${Number(item.measurement).toFixed(2)} s`;
    }
    if (item.units === "lb") {
      return `${Number(item.measurement).toFixed(1)} lb`;
    }
    return item.measurement ?? "-"
  }
  
  if(loadingLeaderboard || loadingMetrics || loadingSports) return <PageLoader />

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Leaderboards</Text>
        </View>
      </View>

      {/* FILTERS AND LEADERBOARD */}
      <ScrollView>

        {/* FILTERS */}
        <View style={styles.pickerCard}>
          <Text style={styles.sectionTitle}>Metric</Text>
          <DropDownPicker 
            open={dropdownOpen.metric}
            setOpen={handleSetOpen("metric")}
            value={metric}
            setValue={setMetric}
            items={metrics.map(m => ({
              label: m.metric,
              value: m.metric,
            }))}
            maxHeight={200}
            zIndex={3000}
            containerStyle={styles.pickerContainer}
            placeholder='Select a Metric'
            placeholderStyle={{ color: 'grey', }}
            searchable={true}
            searchPlaceholder='Search for a Metric'
            listMode="SCROLLVIEW"
          />
          <Text style={styles.sectionTitle}>Sport</Text>
          <DropDownPicker 
            open={dropdownOpen.sport}
            setOpen={handleSetOpen("sport")}
            value={sport}
            setValue={setSport}
            items={sports.map(s => ({
              label: s.sport,
              value: s.sport,
            }))}
            maxHeight={200}
            zIndex={2500}
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
            open={dropdownOpen.gender}
            setOpen={handleSetOpen("gender")}
            value={gender}
            setValue={setGender}
            items={[
              {label: "Male", value: "Male"},
              {label: "Female", value: "Female"},
            ]}
            maxHeight={200}
            zIndex={2000}
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
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
            listMode='SCROLLVIEW'
          />
          <Text style={styles.sectionTitle}>Age Range</Text>
          <DropDownPicker 
            open={dropdownOpen.age}
            setOpen={handleSetOpen("age")}
            value={ageRange}
            setValue={setAgeRange}
            items={ageRanges}
            maxHeight={200}
            zIndex={1500}
            containerStyle={styles.pickerContainer}
            placeholder='Select Age Range'
            placeholderStyle={{ color: "grey" }}
            searchable={false}
            listMode='SCROLLVIEW'
            multiple={false}
          />
        </View>

        {/* LEADERBOARD */}
        {metric ? (
          <LeaderboardList data={filteredData} />
        ) : (
          <View style={styles.sectionTitleCenter}>
            <Text style={styles.sectionTitle}>Select a Metric to Show its Leaderboard</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}