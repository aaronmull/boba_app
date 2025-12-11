// React / hooks
import { useEffect, useState } from "react"

// Navigation & auth
import { useRouter, Link } from "expo-router"
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo"

// UI components
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native"
import { Image } from "expo-image"
import { Ionicons, AntDesign } from "@expo/vector-icons"

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
import { useAdmin } from "../../hooks/admin/useAdmin"


export default function Page() {
  const { user } = useUser()
  const { performances, summary, metrics, loadingData, loadData, undoData } = useData(user.id)
  const { allData, loadingAdmin, loadAdminData } = useAdmin();
  const { athletes, userData, loadingAthletes, loadAthletes } = useAthletes(user.id)
  const [ refreshing, setRefreshing ] = useState(false)
  const router = useRouter();

  const role = user.publicMetadata.role;
  const isCoach = role == "coach";
  const performanceList = isCoach ? allData : performances;
  
  const onRefresh = async () => {
    setRefreshing(true);
    if (isCoach) {
      await Promise.all([loadAdminData(), loadAthletes()]);
    } else {
      await Promise.all([loadData(), loadAthletes()]);
    }
    setRefreshing(false);
  };


  useEffect(() => {
    if(user?.id)
    {
      loadData()
      loadAthletes()
    }
  }, [user?.id])

  if(((isCoach && loadingAdmin) || (!isCoach && loadingData) || loadingAthletes) && !refreshing)
    return <PageLoader />;

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
        
        <View style={styles.categoryGrid}>
            {/* Add condition to check if the athlete wants to be on the leaderboards*/}
            {true && (
              <TouchableOpacity style={styles.addButton} onPress={() => router.push("/leaderboards")}>
                <Ionicons name="list-sharp" size={20} color="#FFF"/>
                <Text style={styles.addButtonText}>View Leaderboards</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/charts")}>
              <AntDesign name="line-chart" size={20} color="#FFF"/>
              <Text style={styles.addButtonText}>View Charts</Text>
            </TouchableOpacity>
        </View>

        {/* MAKE SURE THIS ONLY RENDERS IF NOT A COACH */} 
        {true && (
          <PersonalBestsCard summary={summary} />
        )}
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Performances</Text>
          <Text style={styles.sectionSubtitle}>Scroll down to refresh</Text>
        </View>
      </View>
      <FlatList 
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={performanceList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <PerformanceItem item={item} performances={performanceList} metrics={metrics} isCoach={isCoach} undoData={undoData}/>
        )}
        ListEmptyComponent={<NoPerformancesFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}