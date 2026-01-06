import { useRouter } from "expo-router";
import { styles } from "../../assets/styles/settings.styles";
import { useUser } from "@clerk/clerk-expo";
import { LeaderboardToggle } from "../../components/LeaderboardToggle";
import PageLoader from "../../components/PageLoader";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function SettingsScreen() {
    const router = useRouter()
    const { isLoaded } = useUser()

    if (!isLoaded) return <PageLoader />

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
                    <LeaderboardToggle />
                </View>
            </ScrollView>
        </View>
    )
}