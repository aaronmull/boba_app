import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Switch, Button, Modal, StyleSheet } from 'react-native'
import { useAthletes } from '../../hooks/athlete/useAthletes'
import React, {useState} from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from "expo-router"

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

      const res = await fetch(`${API_URL}/athletes/link`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          clerkUserId: userId,
          athleteId: selectedAthlete.id,
          showOnLeaderboard,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err)
      }

      const data = await res.json();
      setLinkedAthlete(data);
      setSuccessModalVisible(true);
      // TODO: add navigation

    } catch (error) {
      console.error(err)     
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error: {error}</Text>
  
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
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

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 280,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
  },
});

export default LinkAthlete