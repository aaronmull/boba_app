import { View, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export const PersonalBestsCard = ({ summary }) => {
  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Personal Bests</Text>
      <Text style={styles.balanceAmount}>placeholder</Text>
      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>placeholder</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
            placeholder
          </Text>
        </View>
        <View style={[styles.balanceStatItem, styles.statDivider]} />
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>placeholder</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
            placeholder
          </Text>
        </View>
      </View>
    </View>
  );
};