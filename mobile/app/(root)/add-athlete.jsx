import { useUser } from "@clerk/clerk-expo"
import { Redirect, useRouter } from "expo-router"
import { useSports } from "../../hooks/sports/useSports"
import { useState } from "react"
import PageLoader from "../../components/PageLoader"
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native"
import { styles } from "../../assets/styles/addathlete.styles"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../../constants/colors"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import DropDownPicker from "react-native-dropdown-picker"
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateAthlete } from "../../hooks/admin/useCreateAthlete"


export default function AddAthlete() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const { sports, loading: loadingSports } = useSports()
    const { createAthlete, loading: loadingCreate } = useCreateAthlete()

    const [ name, setName ] = useState('')
    const [ sport, setSport ] = useState([])
    const [ gender, setGender ] = useState([])
    const [ dob, setDob ] = useState(new Date(1598051730000))

    const [ dropdownOpen, setDropdownOpen ] = useState({
        sport: false,
        gender: false,
    })

    const closeAll = () => setDropdownOpen({ sport: false, gender: false, })

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

    const onChange = (_, selectedDate) => {
        setDob(prev => selectedDate ?? prev)
    }

    const onPress = async () => {
        if(!name || !gender || !sport) {
            Alert.alert("All Fields Required")
            return
        }
        try {
            await createAthlete({
                name: name,
                dob: dob,
                gender: gender,
                sport: sport,
            })

            Alert.alert(
                "Athlete successfully created!",
                "A new Boba Athlete has been added to the database.",
            )
        } catch (err) {
            Alert.alert(err.message)
        }
    }

    const role = user.publicMetadata.role;
    const isCoach = role == "coach";

    if(!isCoach) return <Redirect href={"/settings"} />
    if(loadingSports || !isLoaded) return <PageLoader />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Create New Athlete</Text>
                </View>
            </View>
            
            <KeyboardAwareScrollView>
                <View style={styles.pickerCard}>
                    {/* Name */}
                    <Text style={styles.sectionTitle}>Name</Text>
                    <TextInput 
                        style={styles.input}
                        value={name}
                        placeholderTextColor={COLORS.textLight}
                        placeholder="Enter name"
                        onChangeText={(name) => setName(name)}
                    />

                    {/* Sport */}
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
                        placeholder="Select a Sport"
                        searchable={true}
                        searchPlaceholder="Search for a Sport"
                        listMode="SCROLLVIEW"
                    />

                    {/* Gender */}
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
                        placeholder="Select a Gender"
                        searchable={false}
                        listMode="SCROLLVIEW"
                    />

                    {/* DOB */}
                    <Text style={styles.sectionTitle}>Date of Birth</Text>
                    <DateTimePicker 
                        value={dob}
                        mode="date"
                        display="spinner"
                        themeVariant={COLORS.theme}
                        textColor={COLORS.textLight}
                        onChange={onChange}
                    />
                </View>

                {/* Save Athlete Button */}
                <View style={styles.buttonView}>
                    <TouchableOpacity style={[styles.addButton, loadingCreate && { opacity: 0.6 }]} disabled={loadingCreate} onPress={onPress}>
                        <Ionicons name="add" size={22} color={COLORS.white} />
                        <Text style={styles.addButtonText}> Create Athlete</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
    


}