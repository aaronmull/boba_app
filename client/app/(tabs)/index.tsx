import SearchBar from '@/components/SearchBar'
import { images } from '@/constants/images'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, ScrollView, View } from 'react-native'

export default function Index() {
  
  const router = useRouter();

  return (
    <View className="flex-1">

      {/* <Image source={images.bg} className="absolute w-full z-0"/> */}

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
        <Image source={images.boba} className='w-48 h-40 mt-20 mb-5 mx-auto' />
        
        <View className="flex-1 mt-5">
          <SearchBar 
            onPress={() => router.push("/charts")}
            placeholder="Search for a metric (change this)"
          />
        </View>

      </ScrollView>

    </View>
  )

}