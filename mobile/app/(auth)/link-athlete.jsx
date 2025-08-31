import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Switch, Button, Modal, StyleSheet } from 'react-native'
import { useAthletes } from '../../hooks/athlete/useAthletes'
import React, {useState} from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from "expo-router"
import { styles } from '../../assets/styles/auth.styles'



const API_URL = "https://boba-app-api.onrender.com/api";

const LinkAthlete = () => {

  const { athletes, loading, error } = useAthletes()
  const { userId, getToken } = useAuth()
  const router = useRouter();

  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [linkedAthlete, setLinkedAthlete] = useState(null)

  async function handleLink() {
    if (!selectedAthlete) return;

    try {
      setSubmitting(true);
      const token = await getToken();

      console.log("🔵 Attempting to link athlete:", {
        userId,
        athleteId: selectedAthlete.id,
        showOnLeaderboard,
      });

      const res = await fetch(`${API_URL}/athletes/link`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // if you want backend Clerk validation:
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          athleteId: selectedAthlete.id,
          clerkUserId: userId,
          showOnLeaderboard,
        }),
      });

      console.log("🟢 Response status:", res.status);
      const text = await res.text();
      console.log("🟢 Raw response text:", text);

      if (!res.ok) {
        throw new Error(text);
      }

      const data = JSON.parse(text);
      console.log("✅ Parsed JSON:", data);

      setLinkedAthlete(data);
      setSuccessModalVisible(true);

    } catch (err) {
      console.error("❌ Link athlete failed:", err);
    } finally {
      setSubmitting(false);
    }
  }


  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error: {error}</Text>
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Link your account to an athlete
      </Text>

      <FlatList
        data={athletes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 12,
              backgroundColor: selectedAthlete?.id === item.id ? "#ddd" : "#fff",
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
            onPress={() => setSelectedAthlete(item)}
          >
            <Text>{item.name}</Text>
            <Text style={{ color: "gray" }}>
              {item.sport} • {item.gender}
            </Text>
          </TouchableOpacity>
        )}
      />

      {selectedAthlete && (
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Show on Leaderboards?</Text>
          <Switch
            value={showOnLeaderboard}
            onValueChange={setShowOnLeaderboard}
          />
        </View>
      )}

      <Button
        title={submitting ? "Linking..." : "Link Athlete"}
        onPress={handleLink}
        disabled={submitting || !selectedAthlete}
      />
      {/* Success Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
              {linkedAthlete ? `Welcome ${linkedAthlete.name}!` : "Welcome!"}
            </Text>
            <Button
              title="Go to Home"
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace("/home");
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LinkAthlete