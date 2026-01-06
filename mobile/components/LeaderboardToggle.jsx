import { ActivityIndicator, Switch, Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useAthletes } from "../hooks/athlete/useAthletes";
import { useLeaderboardPreference } from "../hooks/athlete/useLeaderboardPreference"
import { styles } from "../assets/styles/charts.styles"

export function LeaderboardToggle() {
    const { user } = useUser()
    const { userData, loadAthletes } = useAthletes(user?.id)
    const { updatePreference, loading } = useLeaderboardPreference()

    if(!userData) return null

    const onToggle = async (value) => {
        await updatePreference({
            clerkUserId: user.id,
            showOnLeaderboard: value,
        })

        await loadAthletes()
    }

    console.log(userData.show_on_leaderboard)

    return (
        <>
            <Text style={styles.sectionTitle}>Show your times on the leaderboards</Text>
            <Text style={styles.leaderboardOptionText}>Other Boba Athletes can view your performances on the leaderboards. </Text>
            <View style={styles.switchContainer}>
                <Switch
                    value={userData.show_on_leaderboard}
                    onValueChange={onToggle}
                    disabled={loading}
                    trackColor={{ false: 'red' }}
                    ios_backgroundColor={'red'}
                    style={styles.switch}
                />
                {loading && (
                    <ActivityIndicator style={[styles.loadingText, styles.leaderboardOptionText]} size="small" />
                )}
            </View>
        </>
    )
}