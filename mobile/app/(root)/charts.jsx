import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAthletes } from '../../hooks/athlete/useAthletes'
import { useData } from '../../hooks/data/useData'
import { useAdmin } from '../../hooks/admin/useAdmin'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/charts.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import { useMetrics } from '../../hooks/metrics/useMetrics'
import DropDownPicker from 'react-native-dropdown-picker';
import Chart from '../../components/Chart'

export default function ChartScreen() {
  const { user } = useUser()
  const router = useRouter()
  const params = useLocalSearchParams()

  // hooks
  const { athletes, loading: loadingAthletes } = useAthletes(user.id)
  const { performances, loading: loadingData } = useData(user.id)
  const { allData, loading: loadingAdminData } = useAdmin()
  const { metrics } = useMetrics()

  const [ metric, setMetric ] = useState(null)
  const [ athlete, setAthlete ] = useState(null)
  const [ width, setWidth ] = useState(true)
  const [ dateRange, setDateRange ] = useState('all') // New state for date range

  const role = user.publicMetadata.role;
  const isCoach = role == "coach";
  const performanceList = isCoach ? allData : performances;
  
  useEffect(() => {
    if (params.metric && !metric) {
      setMetric(params.metric)
    }
  }, [params.metric])

  const [ dropdownOpen, setDropdownOpen ] = useState({
    metric: false,
    athlete: false,
    dateRange: false, // New dropdown state
  })

  const closeAll = () => setDropdownOpen({ 
    metric: false, 
    athlete: false,
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

  // Date range options
  const dateRangeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Last 3 Months', value: '3months' },
    { label: 'Last 6 Months', value: '6months' },
    { label: 'Last Year', value: '1year' },
  ]

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

  const filteredData = performanceList
    .filter(entry => !metric || entry.metric === metric)
    .filter(entry => !athlete || entry.athlete_name === athlete)
    .filter(entry => {
      if (dateRange === 'all') return true
      const threshold = getDateThreshold()
      return new Date(entry.created_at) >= threshold
    })

  const sorted = [...filteredData].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const chartData = useMemo(() => {
    if (!sorted.length) return null;

    return {
      labels: sorted.map(entry =>
        new Date(entry.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ),
      datasets: [
        {
          data: sorted.map(entry => entry.measurement),
          strokeWidth: 2,
        },
      ],
    };
  }, [sorted]);

  if(loadingAthletes || loadingData || (isCoach && loadingAdminData)) return <PageLoader />

  const canRenderChart = isCoach
    ? Boolean(metric && athlete)
    : Boolean(metric)

  const widthMessage = width
    ? "Condense Chart Width"
    : "Expand Chart Width"

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Your Charts</Text>
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
                zIndex={3000}
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
                placeholder='Select an Athlete'
                searchable={true}
                searchPlaceholder='Search for an Athlete'
                listMode="SCROLLVIEW"
              />
            </>
          )}

          {/* Date Range Filter */}
          <Text style={styles.sectionTitle}>Date Range</Text>
          <DropDownPicker 
            open={dropdownOpen.dateRange}
            setOpen={handleSetOpen("dateRange")}
            value={dateRange}
            setValue={setDateRange}
            items={dateRangeOptions}
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
            placeholder='Select Date Range'
            listMode="SCROLLVIEW"
          />

          {/* Width Switcher */}
          {canRenderChart && chartData && (
            <TouchableOpacity style={styles.logoutButton} onPress={() => setWidth(prev => !prev)}>
              <Text style={styles.logoutButtonText}>{widthMessage}</Text>
            </TouchableOpacity>
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
        {canRenderChart && chartData === null && (
          <View style={styles.sectionTitleCenter}>
            <Text style={styles.sectionTitle}>
              No data to view for {metric} in selected date range
            </Text>
          </View>
        )}
        {canRenderChart && chartData && (
          <>
            <View style={styles.sectionTitleCenter}>
              <Text style={styles.sectionTitle}>{metric} Chart</Text>
            </View>
            <View>
              <Chart 
                chartKey={`${metric}-${athlete ?? "self"}-${dateRange}`} 
                data={chartData} 
                metric={metric}
                units={filteredData[0]?.units}
                widthChoice={width}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )

}