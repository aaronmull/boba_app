import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useMetrics } from '../../hooks/metrics/useMetrics'
import { useAthletes } from '../../hooks/athlete/useAthletes'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { API_URL } from '../../constants/api'
import { React, useState, useEffect, useRef} from 'react'
import { styles } from '../../assets/styles/create.styles'
import { COLORS } from '../../constants/colors'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'
import DropDownPicker from 'react-native-dropdown-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const CreateScreen = () => {

    const router = useRouter()
    const { user } = useUser()

    const { metrics } = useMetrics()
    const { athletes } = useAthletes()

    const [metric, setMetric] = useState(null)
    const [athlete, setAthlete] = useState(null)
    const [performance, setPerformance] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [feet, setFeet] = useState("")
    const [inches, setInches] = useState("")

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
    
    const role = user.publicMetadata.role;
    const isCoach = role == "coach";
    if(!isCoach){
        return (
            <View>
                <Text>
                    You do not have permission to view this page.
                </Text>
            </View>
        )
    }

    const handleCreate = async () => {
        // validations
        if (!metric) return Alert.alert("Error", "Please select a metric");
        if (!athlete) return Alert.alert("Error", "Please select an athlete");
        
        if(metric.is_time) {
            if (!performance || isNaN(performance)) {
                return Alert.alert("Error", "Please enter a valid time")
            }
        } else {
            const ft = parseFloat(feet) || 0;
            const inch = parseFloat(inches) || 0;
            const totalInches = ft * 12 + inch;
            if (totalInches <= 0) {
                return Alert.alert("Error", "Please enter a valid distance in feet and inches.");
            }
        }
        setIsLoading(true)
        try {
            let finalMeasurement;
            if(metric.is_time) {
                finalMeasurement = parseFloat(performance);
            } else {
                const ft = parseFloat(feet) || 0;
                const inch = parseFloat(inches) || 0;
                finalMeasurement = ft * 12 + inch;
            }

            console.log('Athlete: ', athlete.name)
            console.log('Metric: ', metric.metric)
            console.log('Performance: ', finalMeasurement)

            const response = await fetch(`${API_URL}/data`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    athleteId: athlete.id,
                    metricId: metric.id,
                    measurement: finalMeasurement,
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
            setFeet("");
            setInches("");

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

            <KeyboardAwareScrollView>
                <View style={styles.pickerCard}>
                    {/* Metric Picker */}
                    <Text style={styles.sectionTitle}>Metric</Text>
                    <DropDownPicker 
                        open={dropdownOpen.metric}
                        setOpen={handleSetOpen("metric")}
                        value={metric?.id || null}  // Use the ID as the value
                        setValue={(callback) => {
                            const selectedId = typeof callback === 'function' ? callback(metric?.id) : callback;
                            const selectedMetric = metrics.find(m => m.id === selectedId);
                            setMetric(selectedMetric);
                        }}
                        items={metrics.map(m => ({
                            label: m.metric,
                            value: m.id,  // Use the ID
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
                        placeholder="Select a Metric"
                        searchable={true}
                        searchPlaceholder="Search for a Metric"
                        listMode="SCROLLVIEW"
                    />

                    {/* Athlete Picker */}
                    <Text style={styles.sectionTitle}>Athlete</Text>
                    <DropDownPicker 
                        open={dropdownOpen.athlete}
                        setOpen={handleSetOpen("athlete")}
                        value={athlete?.id || null}  // Use the ID as the value
                        setValue={(callback) => {
                            const selectedId = typeof callback === 'function' ? callback(athlete?.id) : callback;
                            const selectedAthlete = athletes.find(a => a.id === selectedId);
                            setAthlete(selectedAthlete);
                        }}
                        items={athletes.map(a => ({
                            label: a.name,
                            value: a.id,  // Use the ID
                        }))}
                        maxHeight={200}
                        zIndex={2000}
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

                    {metric && athlete && (
                        <View>
                            {/* Time or distance? */}
                            {metric.is_time ? (
                                <>
                                    <Text style={styles.sectionTitle}>Time (s)</Text>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder='Enter a time'
                                        placeholderTextColor={COLORS.textLight}
                                        value={performance}
                                        onChangeText={setPerformance}
                                    />
                                </>
                            ) : (
                                <>
                                    <Text style={styles.sectionTitle}>Distance</Text>
                                    <View style={styles.amountContainer}>
                                        {/* Feet Input */}
                                        <TextInput
                                            style={[styles.input, { textAlign: "center" }]}
                                            placeholder="XX"
                                            placeholderTextColor={COLORS.textLight}
                                            keyboardType="numeric"
                                            value={feet}
                                            onChangeText={setFeet}
                                        />
                                        <Text style={styles.currencySymbol}>'</Text>

                                        {/* Inches Input */}
                                        <TextInput
                                            style={[styles.input, { textAlign: "center" }]}
                                            placeholder="XX"
                                            placeholderTextColor={COLORS.textLight}
                                            keyboardType="numeric"
                                            value={inches}
                                            onChangeText={setInches}
                                        />
                                        <Text style={styles.currencySymbol}>"</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    )}

                </View>
            </KeyboardAwareScrollView>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )}
        </View>
    )
}

export default CreateScreen