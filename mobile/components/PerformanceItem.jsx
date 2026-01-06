import { View, Text, TouchableOpacity, Touchable } from "react-native"
import { FontAwesome5, Entypo, MaterialDesignIcons, Ionicons } from "@expo/vector-icons"
import { styles } from "../assets/styles/home.styles"
import { COLORS } from "../constants/colors"
import { formatDate } from "../lib/utils"

// https://oblador.github.io/react-native-vector-icons/
// Map units to respective icons
const METRIC_ICONS = {
    s :  {component: FontAwesome5,        name: "running"},
    in : {component: Entypo,              name: "ruler"},
    lb : {component: MaterialDesignIcons, name: "weight-lifter"},
}

export const PerformanceItem = ({ item, performances, metrics, isCoach, undoData }) => {
    // Get the icon object that corresponds with the unit,
    // Get the component needed to render the icon through expo/vector-icons
    const iconConfig = METRIC_ICONS[item.units]
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
            const inches = Math.round(totalInches % 12);
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

    return (
        <View style={styles.transactionCard}>
            <TouchableOpacity style={styles.transactionContent}>
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