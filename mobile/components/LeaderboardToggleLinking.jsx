import { Switch, Text, View } from "react-native";
import { styles } from "../assets/styles/charts.styles";

export function LeaderboardToggleLinking({ value, onValueChange, disabled }) {
    return (
        <>
            <Text style={styles.sectionTitle}>Show your times on the leaderboards?</Text>
            <Text style={styles.leaderboardOptionText}>You can always change this option in Settings</Text>
            <View style={styles.switchContainer}>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    disabled={disabled}
                    trackColor={{ false: 'red' }}
                    ios_backgroundColor={'red'}
                    style={styles.switch}
                />
            </View>
        </>
    )
}