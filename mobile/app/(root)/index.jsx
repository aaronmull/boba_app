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
import { formatDate } from "../../lib/utils"


export default function Page() {
  const { user } = useUser()
  const { performances, summary, metrics, loading, loadData } = useData(user.id)
  const [ refreshing, setRefreshing ] = useState(false)
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  if(loading && !refreshing) return <PageLoader />

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
              {user?.emailAddresses[0]?.emailAddress.split("@")[0]} {/* ADD USERNAME FUNCTIONALITY AND CHANGE THIS */}
            </Text>
          </View>
          </View>
          {/* RIGHT -- Figure out what to do with add button and admin permissions */}
          {/* Going to need to make a different homepage for admin users that shows the add button */}
          <View style={styles.headerRight}>
            <SignOutButton />
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
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
          <PerformanceItem item={item} performances={performances} metrics={metrics}/>
        )}
        ListEmptyComponent={<NoPerformancesFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}