import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import {Slot, SplashScreen, Stack} from 'expo-router'
import "../../global.css";
import { useFonts } from 'expo-font';
import  GlobalProvider from '../../context/GlobalProvider'

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [FontsLoaded, error] =useFonts({
    "Poppings-Black":require("../../assets/fonts/Poppins-Black.ttf"),
    "Poppings-Bold":require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppings-ExtraBold":require("../../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppings-ExtraLight":require("../../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppings-Light":require("../../assets/fonts/Poppins-Light.ttf"),
    "Poppings-Medium":require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppings-Regular":require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppings-SemiBold":require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppings-Thin":require("../../assets/fonts/Poppins-Thin.ttf"), 
  });

  useEffect(() => {
    if(error) throw error;

    if(FontsLoaded) SplashScreen.hideAsync();

  }, [FontsLoaded, error])

  if(!FontsLoaded && !error) return null;

  return( 
    <GlobalProvider>
    <Stack>
      <Stack.Screen name = "index" options={{headerShown: false}} />
      <Stack.Screen name = "(auth)" options={{headerShown: false}} />
      <Stack.Screen name = "(screens)" options={{headerShown: false}} />
    </Stack>
    </GlobalProvider>
  )
}

export default RootLayout