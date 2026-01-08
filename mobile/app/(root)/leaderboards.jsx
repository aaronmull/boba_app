import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLeaderboardData } from '../../hooks/data/useLeaderboardData'
import PageLoader from '../../components/PageLoader'
import { useMetrics } from '../../hooks/metrics/useMetrics'
import { useSports } from '../../hooks/sports/useSports'
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../../assets/styles/leaderboard.styles'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import { getAge } from '../../lib/utils'
import LeaderboardList from '../../components/LeaderboardList'

export default function LeaderboardScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { leaderboardData, loading: loadingLeaderboard, error: dataError } = useLeaderboardData()
  const { metrics, loading: loadingMetrics, error: metricsError } = useMetrics()
  const { sports, loading: loadingSports, error: sportsError, loadSports } = useSports()

  const [ metric, setMetric ] = useState(null)
  const [ sport, setSport ] = useState([])
  const [ ageRange, setAgeRange ] = useState('all')
  const [ gender, setGender ] = useState([])
  const [ dateRange, setDateRange ] = useState('all') // New state for date range
  const [ viewAdditionalFilters, setViewAdditionalFilters ] = useState(false)

  useEffect(() => {
    if (params.metric && !metric) {
      setMetric(params.metric)
    }
  }, [])

  // Dropdown Pickers
  const [dropdownOpen, setDropdownOpen] = useState({
    metric: false,
    sport: false,
    age: false,
    gender: false,
    dateRange: false, // New dropdown state
  })

  const closeAll = () =>
    setDropdownOpen({
      metric: false, 
      sport: false, 
      age: false, 
      gender: false,
      dateRange: false,
    })

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
    { label: "All Ages", value: "all" },
    { label: "Middle School (11-14)", value: "middle" },
    { label: "High School (13-19)", value: "high"},
    { label: "College & Older (17+)", value: "college" },
  ]

  // Date range options
  const dateRangeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Last 3 Months', value: '3months' },
    { label: 'Last 6 Months', value: '6months' },
    { label: 'Last Year', value: '1year' },
  ]

  function athleteInAgeRange(athlete, range) {
    if (range === "all") return true;
    const age = getAge(athlete.dob)
    if(age < 12) return false;
    if(range === "middle")  return age >= 11 && age <= 14
    if(range === "high")    return age >= 13 && age <= 19
    if(range === "college") return age >= 17
    return true;
  }

  // Filter data by date range
  const getDateThreshold = () => {
    const now = new Date()
    switch(dateRange) {
      case '7days':
        return new Date(now.setDate(now.getDate() - 7))
      case '30days':
        return new Date(now.setDate(now.getDate() - 30))
      case '3months':
        return new Date(now.setMonth(now.getMonth() - 3))
      case '6months':
        return new Date(now.setMonth(now.getMonth() - 6))
      case '1year':
        return new Date(now.setFullYear(now.getFullYear() - 1))
      default:
        return null
    }
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
    .filter(entry => ageRange === 'all' || athleteInAgeRange(entry, ageRange))
    // filter based on date range
    .filter(entry => {
      if (dateRange === 'all') return true
      const threshold = getDateThreshold()
      return new Date(entry.created_at) >= threshold
    })

  const onPress = async () => {
    setViewAdditionalFilters(prev => !prev)
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
            zIndex={4000}
            containerStyle={styles.pickerContainer}
            style={{
                borderColor: COLORS.border,
                backgroundColor: COLORS.card,
            }}
            textStyle={{
                color: COLORS.textLight,
                fontSize: 16,
                paddingLeft: 4,
            }}
            dropDownContainerStyle={{
                borderColor: COLORS.border,
                backgroundColor: COLORS.card,
            }}
            searchTextInputStyle={{
                borderColor: COLORS.border,
            }}
            searchContainerStyle={{
                borderBottomColor: COLORS.border,
            }}
            placeholderStyle={{ color: COLORS.textLight, }}
            placeholder='Select a Metric'
            searchable={true}
            searchPlaceholder='Search for a Metric'
            listMode="SCROLLVIEW"
          />

          <TouchableOpacity style={styles.logoutButton} onPress={onPress}>
            {viewAdditionalFilters ? (
              <AntDesign name="minus" size={22} color={COLORS.text} />
            ) : (
              <Ionicons name="add" size={24} color={COLORS.text}/>
            )}
            <Text style={styles.logoutButtonText}>
              {viewAdditionalFilters ? 'Hide Additional Filters' : 'View Additional Filters'}
            </Text>
          </TouchableOpacity>

          {/* Hidden initially */}
          {viewAdditionalFilters && (
            <>
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
                style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.card,
                }}
                textStyle={{
                    color: COLORS.textLight,
                    fontSize: 16,
                    paddingLeft: 4,
                }}
                dropDownContainerStyle={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.card,
                }}
                searchTextInputStyle={{
                    borderColor: COLORS.border,
                }}
                searchContainerStyle={{
                    borderBottomColor: COLORS.border,
                }}
                placeholderStyle={{ color: COLORS.textLight, }}
                placeholder='Select Sport(s)'
                searchable={true}
                searchPlaceholder='Search for a Sport'
                multiple={true}
                min={0}
                max={20}
                mode="BADGE"
                showBadgeDot={false}
                multipleText="%d selected"
                badgeTextStyle={{ 
                  fontSize: 14,
                  color: COLORS.textLight,
                }}
                badgeColors={[COLORS.background]}
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
                style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.card,
                }}
                textStyle={{
                    color: COLORS.textLight,
                    fontSize: 16,
                    paddingLeft: 4,
                }}
                dropDownContainerStyle={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.card,
                }}
                placeholderStyle={{ color: COLORS.textLight, }}
                placeholder='Select Gender(s)'
                searchable={false}
                multiple={true}
                min={0}
                max={2}
                mode="BADGE"
                showBadgeDot={false}
                multipleText="%d selected"
                badgeTextStyle={{ 
                  fontSize: 14,
                  color: COLORS.textLight,
                }}
                badgeColors={[COLORS.background]}
                badgeStyle={{
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
                listMode='SCROLLVIEW'
              />
              <Text style={styles.sectionTitle}>Date Range</Text>
              <DropDownPicker 
                open={dropdownOpen.dateRange}
                setOpen={handleSetOpen("dateRange")}
                value={dateRange}
                setValue={setDateRange}
                items={dateRangeOptions}
                maxHeight={200}
                zIndex={1700}
                containerStyle={styles.pickerContainer}
                style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.card,
                }}
                textStyle={{
                    color: COLORS.textLight,
                    fontSize: 16,
                    paddingLeft: 4,
                }}
                dropDownContainerStyle={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.card,
                }}
                placeholderStyle={{ color: COLORS.textLight, }}
                placeholder='Select Date Range'
                listMode="SCROLLVIEW"
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
                style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.card,
                }}
                textStyle={{
                    color: COLORS.textLight,
                    fontSize: 16,
                    paddingLeft: 4,
                }}
                dropDownContainerStyle={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.card,
                }}
                placeholderStyle={{ color: COLORS.textLight, }}
                placeholder='Select Age Range'
                searchable={false}
                listMode='SCROLLVIEW'
                multiple={false}
              />
            </>
          )}
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