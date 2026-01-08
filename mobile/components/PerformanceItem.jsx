import { View, Text, TouchableOpacity, Alert } from "react-native"
import { FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import { styles } from "../assets/styles/home.styles"
import { COLORS } from "../constants/colors"
import { formatDate } from "../lib/utils"
import { useRouter } from "expo-router"


// https://oblador.github.io/react-native-vector-icons/
// Map units to respective icons
const METRIC_ICONS = {
    s :  {component: FontAwesome5,        name: "running"},
    in : {component: Entypo,              name: "ruler"},
    lb : {component: MaterialCommunityIcons, name: "weight-lifter"},
}

const OTHER_ICONS = {
    "10m Fly" : { component: MaterialCommunityIcons, name: "run-fast" },
}

export const PerformanceItem = ({ item, performances, metrics, isCoach, undoData }) => {
    // Get the icon object that corresponds with the unit,
    // Get the component needed to render the icon through expo/vector-icons
    const router = useRouter()

    const getIconConfig = (item) => {
        if (item.metric === "10m Fly") {
            return OTHER_ICONS[item.metric]
        }
        return METRIC_ICONS[item.units]
    }

    const iconConfig = getIconConfig(item)
    const IconComponent = iconConfig?.component

    // Get the metric table entry that corresponds to the performance metric,
    // Get the isTime attribute from the table entry for ranking logic
    const metricInfo = metrics.find(m => m.id === item.metric_id)
    const isTime = metricInfo?.is_time

    const metricPerformances = performances
        .filter(p => p.metric_id === item.metric_id)
        .sort((a, b) => {
            if (isTime) {
                return a.measurement-b.measurement
            } else {
                return b.measurement-a.measurement
            }
        })
    
    const rank = metricPerformances.findIndex(p => p.id === item.id) + 1

    let label = null
    if (rank === 1) { 
        if(isCoach) label = "🏆 Boba Record"
        else        label = "🏆 Personal Best"
    }
    else if (rank <= 5) label = `🔥 Top ${rank}`

    let iconColor = COLORS.income
    if (rank === 1) 
        iconColor = COLORS.pb
    else if (rank === 2) 
        iconColor = COLORS.silver
    else if (rank === 3) 
        iconColor = COLORS.bronze

    let performanceColor = COLORS.other
    if (rank === 1) 
        performanceColor = COLORS.pb
    else if (rank === 2) 
        performanceColor = COLORS.silver
    else if (rank === 3) 
        performanceColor = COLORS.bronze
    
    const formatPerformance = (item) => {
        if(item.units === "in") {
            if(item.metric === "Vertical Jump") return `${item.measurement}"`
            const totalInches = Number(item.measurement);
            const feet = Math.floor(totalInches / 12);
            const inches = totalInches % 12;
            return `${feet}' ${inches}"`;
        }
        if (item.units === "s") {
            return `${Number(item.measurement).toFixed(2)} s`;
        }
        if (item.units === "lb") {
            return `${Number(item.measurement).toFixed(1)} lb`;
        }
        return item.measurement ?? "-"
    }

    const mph = Number(20.45 / item.measurement).toFixed(2)

    const onPress = async () => {
        return Alert.alert(
            "View your Data",
            "Would you like to view your data on the leaderboard or your chart?",
            [
                {
                    text: "Leaderboards",
                    onPress: () => {
                        router.push({
                            pathname: "/leaderboards",
                            params: { metric: item.metric }
                        })
                    }
                },
                {
                    text: "Charts",
                    onPress: () => {
                        router.push({
                            pathname: "/charts",
                            params: { metric: item.metric }
                        })
                    }
                },
                {
                    text: "Cancel",
                    style: 'cancel'
                }
            ]
        )
    }

    return (
        <View style={styles.transactionCard}>
            <TouchableOpacity style={styles.transactionContent} onPress={onPress}>
                <View style={styles.categoryIconContainer}>
                    {IconComponent && (
                        <IconComponent
                            name={iconConfig.name}
                            size={22}
                            color={iconColor}
                        />
                    )}
                </View>
                <View style={styles.transactionLeft}>
                    <Text style={styles.transactionTitle}>{item.metric}</Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: performanceColor }]}>
                        {formatPerformance(item)}
                    </Text>
                    {item.units === 's' && item.metric !== "40yd Dash" && (
                        <Text style={styles.transactionDate}>Speed: {mph}mph</Text>
                    )}
                    {isCoach && (
                        <Text style={styles.transactionDate}>{item.athlete_name}</Text>
                    )}
                    {label && (
                        <Text style={styles.transactionDate}>{label}</Text>
                    )}
                    <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
                </View>
            </TouchableOpacity>
            {/* Delete button */}
            {isCoach && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => undoData(item.id)}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
                </TouchableOpacity>
            )}
        </View>
    )
}