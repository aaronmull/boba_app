import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useAthletes } from '../../hooks/athlete/useAthletes'
import { useData } from '../../hooks/data/useData'
import { useAdmin } from '../../hooks/admin/useAdmin'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/charts.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import { useMetrics } from '../../hooks/metrics/useMetrics'
import DropDownPicker from 'react-native-dropdown-picker';

export default function ChartScreen() {
  const { user } = useUser()
  const router = useRouter()
  // hooks
  const { athletes, userData, loading: loadingAthletes, loadAthletes } = useAthletes(user.id)
  const { performances, summary, metrics: metricsData, loading: loadingData, loadData, undoData } = useData(user.id)
  const { allData, loading: loadingAdminData, loadAdminData } = useAdmin()
  const { metrics: metrics, loading: loadingMetrics, error: metricsError } = useMetrics()

  const [ metric, setMetric ] = useState(null)
  const [ athlete, setAthlete ] = useState(null)

  const role = user.publicMetadata.role;
  const isCoach = role == "coach";
  const performanceList = isCoach ? allData : performances;
  
  const [ dropdownOpen, setDropdownOpen ] = useState({
    metric: false,
    athlete: false,
  })

  const closeAll = () => setDropdownOpen({ metric: false, athlete: false, })

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

  if(loadingAthletes || loadingData || (isCoach && loadingAdminData)) return <PageLoader />

  const canRenderChart = isCoach
    ? Boolean(metric && athlete)
    : Boolean(metric)

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Charts</Text>
        </View>
      </View>

      {/* FILTERS AND CHART */}
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

          {isCoach && (
            <>
              <Text style={styles.sectionTitle}>Athlete</Text>
              <DropDownPicker 
                open={dropdownOpen.athlete}
                setOpen={handleSetOpen("athlete")}
                value={athlete}
                setValue={setAthlete}
                items={athletes.map(a => ({
                  label: a.name,
                  value: a.name,
                }))}
                maxHeight={200}
                zIndex={2000}
                containerStyle={styles.pickerContainer}
                placeholder='Select an Athlete'
                placeholderStyle={{ color: 'grey', }}
                searchable={true}
                searchPlaceholder='Search for an Athlete'
                listMode="SCROLLVIEW"
              />
            </>
          )}

        </View>
        {/* CHART */}
        {!canRenderChart && (
          <View style={styles.sectionTitleCenter}>
            <Text style={styles.sectionTitle}>
              {isCoach
                ? "Select a Metric and an Athlete to view the Chart"
                : "Select a Metric to view your Chart" 
              }
            </Text>
          </View>
        )}
        {canRenderChart && (
          <>
            <View style={styles.sectionTitleCenter}>
              <Text style={styles.sectionTitle}>Chart will go here</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )

}