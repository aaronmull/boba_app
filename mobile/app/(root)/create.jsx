import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useMetrics } from '../../hooks/metrics/useMetrics'
import { useAthletes } from '../../hooks/athlete/useAthletes'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo' // Check for a function that returns if the user has administrator permissions
import { API_URL } from '../../constants/api'
import { React, useState, useEffect, useRef} from 'react'
import { styles } from '../../assets/styles/create.styles'
import { COLORS } from '../../constants/colors'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import CustomBottomSheet from '../../components/CustomBottomSheet'
import { TextInput } from 'react-native-gesture-handler'

const CreateScreen = () => {

    const router = useRouter()
    const { user } = useUser()
    const metricRef = useRef(null)
    const athleteRef = useRef(null)


    const { metrics, mLoading, mError } = useMetrics()
    const { athletes, aLoading, aError } = useAthletes()

    const [metric, setMetric] = useState(null)
    const [athlete, setAthlete] = useState(null)
    const [performance, setPerformance] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedSheet, setSelectedSheet] = useState(true)
     
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

            console.log('Athlete: ', athlete.name)
            console.log('Metric: ', metric.metric)
            console.log('Performance: ', performance)

            const response = await fetch(`${API_URL}/data`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    athleteId: athlete.id,
                    metricId: metric.id,
                    measurement: parseFloat(performance)
                }),
            })

            if(!response.ok) {
                const errorText = await response.text();
                console.log("Server error response:", errorText);
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { error: errorText };
                }
                throw new Error(errorData.error || "Failed to create performance");
            }

            Alert.alert("Succcess", "Performance created successfully")

            setAthlete(null);
            setPerformance("");

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

            <View style={styles.card}>
                <View style={styles.typeSelector}>

                    {/* Metric Selector */}
                    <TouchableOpacity
                        style={[styles.typeButton, selectedSheet && styles.typeButtonActive]}
                        onPress={() => {
                            athleteRef.current?.close()
                            metricRef.current?.expand()
                            setSelectedSheet(true)
                        }}
                    >
                        <FontAwesome5
                            name="ruler-horizontal"
                            size={22}
                            color={selectedSheet ? COLORS.white : COLORS.typeButtonText}
                            style={styles.typeIcon}
                        />
                        <Text style={[styles.typeButtonText, selectedSheet && styles.typeButtonTextActive]}>
                            {metric ? metric.metric : 'Select Metric'}
                        </Text>
                    </TouchableOpacity>

                    {/* Athlete Selector */}
                    <TouchableOpacity
                        style={[styles.typeButton, !selectedSheet && styles.typeButtonActive]}
                        onPress={() => {
                            metricRef.current?.close()
                            athleteRef.current?.expand()
                            setSelectedSheet(false)
                        }}
                    >
                        <FontAwesome5
                            name="running"
                            size={22}
                            color={!selectedSheet ? COLORS.white : COLORS.typeButtonText}
                            style={styles.typeIcon}
                        />
                        <Text style={[styles.typeButtonText, !selectedSheet && styles.typeButtonTextActive]}>
                            {athlete ? athlete.name : 'Select Athlete'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Performance -- will have to edit to make ft. measurements easier to input */}
                {metric && athlete && (
                    <View style={styles.amountContainer}>

                        {/* {!metric.is_time && (
                            <Text>In progress</Text>
                        )} */}

                        <TextInput 
                            style={styles.amountInput}
                            placeholder="Please enter performance"
                            placeholderTextColor={COLORS.textLight}
                            value={performance}
                            onChangeText={setPerformance}
                            keyboardType="numeric"
                        />
                        <Text style={styles.currencySymbol}>{metric.units}.</Text>



                    </View>
                )}

            </View>

            <CustomBottomSheet 
                ref={metricRef}
                title="Select Metric"
                data={metrics || []}
                onSelect={setMetric}
                selectedItem={metric}
             />

            <CustomBottomSheet 
                ref={athleteRef} 
                title="Select Athlete"
                data={athletes || []}
                onSelect={setAthlete}
                selectedItem={athlete}
            />
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )}
        </View>
    )
}

export default CreateScreen