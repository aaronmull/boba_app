import { useUser } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { useCreateMetric } from "../../hooks/admin/useCreateMetric";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "../../assets/styles/addmetric.styles"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput, TouchableOpacity, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import PageLoader from "../../components/PageLoader";

export default function AddMetric() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const { createMetric, loading } = useCreateMetric()

    const [ metricName, setMetricName ] = useState('')
    const [ units, setUnits ] = useState('')
    const [ open, setOpen ] = useState(false)
    const [ items, setItems ] = useState([
        {label: "Seconds (s)", value: "s"},
        {label: "Feet / Inches (stored as inches)", value: "in"},
        {label: "Pounds (lbs)", value: "lb"},
    ])

    const onPress = async () => {
        const isTime = units === "s"
        if(!metricName || !units) {
            Alert.alert("All Fields Required")
            return
        }
        try {
            await createMetric({
                metric: metricName,
                units: units,
                isTime: isTime,
            })

            Alert.alert(
                "Metric successfully created!",
                "A new Metric has been added to the database.",
            )
        } catch (err) {
            Alert.alert(err.message)
        }
    }

    const role = user.publicMetadata.role;
    const isCoach = role == "coach";

    if(!isCoach) return <Redirect href={"/"} />
    if(loading || !isLoaded) return <PageLoader />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Create New Metric</Text>
                </View>
            </View>

            <KeyboardAwareScrollView>
                <View style={styles.pickerCard}>

                    <Text style={styles.sectionTitle}>Metric Name</Text>
                    <TextInput 
                        style={styles.input}
                        value={metricName}
                        placeholderTextColor='#9A8478'
                        placeholder="Enter metric name"
                        onChangeText={(metricName) => setMetricName(metricName)}
                    />

                    <Text style={styles.sectionTitle}>Units</Text>
                    <DropDownPicker 
                        open={open}
                        setOpen={setOpen}
                        value={units}
                        setValue={setUnits}
                        items={items}
                        setItems={setItems}
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
                        placeholderStyle={{ color: "#9A8478", }}
                        placeholder={'Select Units'}
                        searchable={false}
                        listMode="SCROLLVIEW"
                    />
                </View>

                <View style={styles.buttonView}>
                    <TouchableOpacity style={[styles.addButton, loading && { opacity: 0.6 }]} disabled={loading} onPress={onPress}>
                        <Ionicons name="add" size={22} color={COLORS.white} />
                        <Text style={styles.addButtonText}> Create Metric</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
    
}