import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router';
import { icons } from '../../../constants';
import { ThemeProvider, useTheme } from '../../../context/ThemeProvider';


const TabIcon = ({ icon, color, name, focused }:any) => {
  return (
    <View className='flex items-center justify-center w-20 gap-1'>
      <Image 
        source={icon}
        resizeMode={"contain"}
        tintColor={color}
        className={"w-7 h-7"}
      />
      <Text className={`text-xs ${focused ? 'font-bold' : 'font-regular'}`} 
        style={{ color, textAlign: 'center', width: 60 }} 
        numberOfLines={1} 
      >
        {name}
      </Text>
    </View>
  )
}
const TabLayout = () => {

  return (
    <>
    <ThemeProvider>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle:{
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 70,
            paddingBottom: 15, 
            paddingTop: 10,
          }
        }}>
        <Tabs.Screen
          name='home'
          options={{
            title:'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title:'Settings',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Settings"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </ThemeProvider>
    </>
  )
}

export default TabLayout