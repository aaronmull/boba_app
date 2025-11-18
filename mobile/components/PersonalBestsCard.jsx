import { View, Text, FlatList } from "react-native";
import { FontAwesome5, Entypo, MaterialDesignIcons } from "@expo/vector-icons";
import { styles } from "../assets/styles/pbcard.styles";
import { COLORS } from "../constants/colors";

const METRIC_ICONS = {
  s:  { component: FontAwesome5,        name: "running" },
  in: { component: Entypo,              name: "ruler" },
  lb: { component: MaterialDesignIcons, name: "weight-lifter" },
};

export const PersonalBestsCard = ({ summary }) => {

  const formatMeasurement = (item) => {
    const value = Number(item.measurement);

    if (item.units === "in") {
      if (item.metric === "Vertical Jump") return `${value}"`;
      const feet = Math.floor(value / 12);
      const inches = Math.round(value % 12);
      return `${feet}' ${inches}"`;
    }

    if (item.units === "s") return `${value.toFixed(2)} s`;
    if (item.units === "lb") return `${value.toFixed(1)} lb`;

    return `${value} ${item.units}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  if (!summary || summary.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Personal Bests</Text>
        <Text style={styles.emptyText}>No personal bests recorded yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Personal Bests</Text>

      <FlatList
        data={summary}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const iconConfig = METRIC_ICONS[item.units];
          const IconComponent = iconConfig?.component;

          return (
            <View style={styles.pbRow}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                {IconComponent && (
                  <IconComponent
                    name={iconConfig.name}
                    size={16}
                    color={COLORS.pb}
                  />
                )}
              </View>

              {/* Metric name */}
              <Text style={styles.metric}>{item.metric}</Text>

              {/* Measurement */}
              <Text style={styles.measurement}>{formatMeasurement(item)}</Text>

              {/* Date */}
              <Text style={styles.date}>{formatDate(item.pb_date)}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};
