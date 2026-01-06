import { TouchableOpacity } from "react-native"
import { styles } from "../assets/styles/home.styles"
import { COLORS } from "../constants/colors"
import { useRouter } from "expo-router"
import { Feather } from "@expo/vector-icons"

export const SettingsButton = () => {

    const router = useRouter()
    return (
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.push("/settings")}>
            <Feather name="settings" size={22} color={COLORS.text} />
        </TouchableOpacity>
    )
}