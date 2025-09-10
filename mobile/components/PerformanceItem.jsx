import { View, Text, TouchableOpacity, Touchable } from "react-native"
import { FontAwesome5, Entypo, MaterialDesignIcons } from "@expo/vector-icons"
import { styles } from "../assets/styles/home.styles"
import { COLORS } from "../constants/colors"
import { formatDate } from "../lib/utils"

// icons? https://oblador.github.io/react-native-vector-icons/
// Map units to respective icons
const METRIC_ICONS = {
    s : {component: FontAwesome5, name: "running"},
    in : {component: Entypo, name: "ruler"},
    lb : {component: MaterialDesignIcons, name: "weight-lifter"},
}

export const PerformanceItem = ({ item, performances, metrics }) => {
    const iconConfig = METRIC_ICONS[item.units]
    const IconComponent = iconConfig?.component

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
    if (rank === 1) label = "🏆 Personal Best"
    else if (rank <= 5) label = `🔥 Top ${rank}`

    return (
        <View style={styles.transactionCard}>
            <TouchableOpacity style={styles.transactionContent}>
                <View style={styles.categoryIconContainer}>
                    {/* Can configure color later */}
                    {IconComponent && (
                        <IconComponent
                            name={iconConfig.name}
                            size={22}
                            color={COLORS.income}
                        />
                    )}
                </View>
                <View style={styles.transactionLeft}>
                    <Text style={styles.transactionTitle}>{item.metric}</Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, rank === 1 && {color: COLORS.pb}]}>
                        {item.measurement} {item.units}
                    </Text>
                    {label && (
                        <Text style={styles.transactionDate}>{label}</Text>
                    )}
                    <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
                </View>
            </TouchableOpacity>
            {/* Omitting delete button, gotta make alternative component for admin users */}
        </View>
    )
}