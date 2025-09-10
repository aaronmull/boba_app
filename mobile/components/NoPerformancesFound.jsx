import { Feather } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"
import { styles } from "../assets/styles/home.styles"
import { COLORS } from "../constants/colors"

const NoPerformancesFound = () => {
    return(
        <View style={styles.emptyState}>
            <Feather 
                name="x"
                size={60}
                color={COLORS.textLight}
                style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateTitle}>No performances yet</Text>
            <Text style={styles.emptyStateText}>
                Get to work!!
            </Text>
        </View>
    )
}

export default NoPerformancesFound;