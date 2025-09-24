import { View, Text, Alert, TouchableOpacity } from 'react-native'
import { useMetrics } from '../../hooks/metrics/useMetrics'
import { useAthletes } from '../../hooks/athlete/useAthletes'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo' // Check for a function that returns if the user has administrator permissions
import { API_URL } from '../../constants/api'
import { React, useState, useEffect } from 'react'
import { styles } from '../../assets/styles/create.styles'
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'

const CreateScreen = () => {

    const router = useRouter()
    const { user } = useUser()

    const { metrics, mLoading, mError } = useMetrics()
    const { athletes, aLoading, aError } = useAthletes()

    const [metric, setMetric] = useState([]) // array so I can send the metric_id to the data table while displaying the name to the user
    const [athlete, setAthlete] = useState([]) // same logic as metrics
    const [performance, setPerformance] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    
    const handleCreate = async () => {
        // validations
        if (!metric) return Alert.alert("Error", "Please select a metric");
        if (!athlete) return Alert.alert("Error", "Please select an athlete");
        if (!performance) { // Might need to add more checks for distance measurements
            Alert.alert("Error", "Please enter a valid number")
            return;
        }

        setIsLoading(true)
        try {
            // if(!metric.is_time) : do feet to inches calculation, make util
            // for now just create performances for time metrics

            const response = await fetch(`${API_URL}/data`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    athleteId: athlete.indexOf,
                    metricId: metric.id,
                    measurement: parseFloat(performance)
                }),
            })

            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create peformance")

            }

            Alert.alert("Succcess", "Performance created successfully")
            // router.back(); Don't want this because we will want to put more data in with the same metric and athlete
            // Maybe this will be where we change the states back to empty for athlete and measurement
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to create performance")
            console.error("Error creating performance", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Performance</Text>
                <TouchableOpacity
                    style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
                    onPress={handleCreate}
                    disabled={isLoading}
                >
                    <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
                    {!isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CreateScreen