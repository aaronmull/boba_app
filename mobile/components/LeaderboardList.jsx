import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { styles } from "../assets/styles/leaderboard.styles";
import { formatDate } from "../lib/utils";

export default function LeaderboardList({ data = [] }) {
  const [showAll, setShowAll] = useState(false);

  // sorting using is_time flag
  const sortLeaderboard = (list) => {
    return [...list].sort((a, b) => {
      if (a.is_time) return a.measurement - b.measurement;
      return b.measurement - a.measurement;
    });
  };

  // formatting performance for display
  const formatPerformance = (item) => {
    if (item.units === "in") {
      if (item.metric === "Vertical Jump") return `${item.measurement}"`;
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
    return item.measurement ?? "-";
  };

  // memoize sorted data so we don't re-sort every render
  const sorted = useMemo(() => sortLeaderboard(data), [data]);

  // displayed data (top 10 by default)
  const displayed = showAll ? sorted : sorted.slice(0, 10);

  const toggleShow = () => setShowAll((s) => !s);

  const renderItem = ({ item }) => {
    // compute rank relative to the whole sorted list
    const rank = sorted.findIndex((d) => d.id === item.id) + 1;
    let medalStyle = null;
    if (rank === 1) medalStyle = styles.gold;
    else if (rank === 2) medalStyle = styles.silver;
    else if (rank === 3) medalStyle = styles.bronze;

    return (
      <View style={styles.row}>
        {/* Rank badge */}
        <View style={[styles.medal, medalStyle || styles.rankContainer]}>
            <Text
                style={rank <= 3 ? styles.medalText : styles.rankText}
            >
                {rank}
            </Text>
            </View>


        {/* Name + Sport + Date */}
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.sportText}>
            {item.sport} • {formatDate(item.created_at)}
          </Text>
        </View>

        {/* Performance (formatted) */}
        <Text style={styles.performanceText}>{formatPerformance(item)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.leaderboardContainer}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Rank</Text>
        <Text style={styles.headerText}>Athlete</Text>
        <Text style={styles.headerText}>Performance</Text>
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
      />

      {/* Show More / Show Less */}
      {sorted.length > 10 && (
        <TouchableOpacity onPress={toggleShow} style={{ marginTop: 10 }}>
          <Text
            style={{
              textAlign: "center",
              color: "#007AFF",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {showAll ? "Show Less" : "Show More"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
