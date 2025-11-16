// React / hooks
import { useEffect, useState } from "react"

// Navigation & auth
import { useRouter, Link } from "expo-router"
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo"

// UI components
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"

// Custom components
import { SignOutButton } from "../../components/SignOutButton"
import PageLoader from "../../components/PageLoader"
import { PersonalBestsCard } from "../../components/PersonalBestsCard"
import { PerformanceItem } from "../../components/PerformanceItem"
import NoPerformancesFound from "../../components/NoPerformancesFound"

// Data & utils
import { useData } from "../../hooks/data/useData"
import { styles } from "../../assets/styles/home.styles"
import { useAthletes } from "../../hooks/athlete/useAthletes"


export default function Page() {
  const { user } = useUser()
  const { performances, summary, metrics, loadingData, loadData, undoData } = useData(user.id)
  const { athletes, userData, loadingAthletes, loadAthletes } = useAthletes(user.id)
  const [ refreshing, setRefreshing ] = useState(false)
  const router = useRouter();

  const role = user.publicMetadata.role;
  const isCoach = role == "coach";
  
  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([loadData(), loadAthletes()])
    setRefreshing(false)
  }

  useEffect(() => {
    if(user?.id)
    {
      loadData()
      loadAthletes()
    }
  }, [user?.id])

  if((loadingData || loadingAthletes) && !refreshing) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image 
            source={require("../../assets/images/boba.png")} 
            style={styles.headerLogo}
            contentFit='contain'
          />
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.usernameText}>
              {userData?.name ?? user?.emailAddresses[0]?.emailAddress.split("@")[0]}
            </Text>
          </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <SignOutButton />
            
            {isCoach && (
              <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                <Ionicons name="add" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <PersonalBestsCard summary={summary} />
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Performances</Text>
        </View>
      </View>
      <FlatList 
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={performances}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <PerformanceItem item={item} performances={performances} metrics={metrics} isCoach={isCoach} undoData={undoData}/>
        )}
        ListEmptyComponent={<NoPerformancesFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}