import { Switch, Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useAthletes } from "../hooks/athlete/useAthletes";
import { useLeaderboardPreference } from "../hooks/athlete/useLeaderboardPreference"

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

    return (
        <View>
            <Text>Show me on leaderboards</Text>
            <Switch
                value={userData.show_on_leaderboard}
                onValueChange={onToggle}
                disabled={loading}
            />
        </View>
    )
}