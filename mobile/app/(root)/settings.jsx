import { useRouter } from "expo-router";
import { styles } from "../../assets/styles/settings.styles";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { LeaderboardToggle } from "../../components/LeaderboardToggle";
import PageLoader from "../../components/PageLoader";
import { ScrollView, TouchableOpacity, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function SettingsScreen() {
    const router = useRouter()
    const { user, isLoaded } = useUser()
    const { signOut } = useAuth()

    if (!isLoaded) return <PageLoader />

    const role = user.publicMetadata.role;
    const isCoach = role == "coach";

    const handleForgotPassword = () => {
        Alert.alert(
            'Reset Password',
            'You need to sign out to reset your password. Would you like to sign out now?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Sign Out',
                    onPress: async () => {
                        await signOut()
                        router.replace('/sign-in')
                    }
                }
            ]
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>
            </View>

            <ScrollView>
                <View style={styles.pickerCard}>

                    {/* Show On Leaderboard*/}
                    <Text style={[styles.sectionTitle, {marginTop: "6"}]}>Show your times on the leaderboards</Text>
                    <Text style={styles.leaderboardOptionText}>Other Boba Athletes can view your performances on the leaderboards.</Text>
                    <LeaderboardToggle />

                    {/* Forgot Password */}
                    <Text style={styles.sectionTitle}>Change / Forgot Password</Text>
                    <Text style={styles.leaderboardOptionText}>You will be prompted to sign out in order to reset your password from the sign in screen.</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleForgotPassword}>
                        <Text style={styles.logoutButtonText}>Forgot Password</Text>
                    </TouchableOpacity>

                    {/* Other settings? */}
                    

                    {/* Coach Only Settings */}
                    {/*
                    {isCoach && (
                        <>
                            <Text style={styles.sectionTitle}>Create New Athletes</Text>
                            <Text style={styles.leaderboardOptionText}>Provide a new Boba Athlete's name, sport, date of birth, and gender to add their profile to the database.</Text>
                            <TouchableOpacity style={styles.logoutButton} onPress={() => router.push("/add-athlete")}>
                                <Text style={styles.logoutButtonText}>Add Athlete</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    */}
                </View>
            </ScrollView>
        </View>
    )
}