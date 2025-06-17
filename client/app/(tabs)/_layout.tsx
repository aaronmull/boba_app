import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'

const TabIcon = ({ focused, icon, title}: any) => {
    
    if(focused) {
        return (
            <ImageBackground 
                source={images.highlight}
                className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
            >
                <Image source={icon} tintColor="FFFFFF" className="size-5" />
                <Text className="text-white text-sm font-semibold ml-2">{title}</Text>
            </ImageBackground>
        )
    }
    
    return (
        <View className="size-full justify-center items-center mt-4 rounded-full">
            <Image source={icon} tintColor="#FFFFFF" className="size-5"/>
        </View>
    )
}

const _layout = () => {
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            },
            tabBarStyle: {
                backgroundColor: '#021B3D',
                borderRadius: 50,
                marginHorizontal: 20,
                marginBottom: 36,
                height: 52,
                position: 'absolute',
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#021B3D'
            }
        }}
    >
        <Tabs.Screen 
            name="index"
            options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused}
                    icon={icons.home}
                    title="Home"/>
                )
            }}
        />
        <Tabs.Screen 
            name="charts"
            options={{
                title: 'Charts',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused}
                    icon={icons.search}
                    title="Charts"/>
                )
            }}
        />
        <Tabs.Screen 
            name="leaderboards"
            options={{
                title: 'Leaderboards',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused}
                    icon={icons.save}
                    title="Leaderboards"/>
                )
            }}
        />
        <Tabs.Screen 
            name="profile"
            options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused}
                    icon={icons.person}
                    title="Profile"/>
                )
            }}
        />
    </Tabs>
  )
}

export default _layout