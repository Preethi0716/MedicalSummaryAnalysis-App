import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider, useTheme } from '../../../context/ThemeProvider';


const AppLayout = () => {
  return (
    <>
      <ThemeProvider>
      <Stack>
        <Stack.Screen 
          name='signin'
          options={{
            headerShown: false

          }}
        />
      </Stack>

      <StatusBar backgroundColor='#161622' style='light' />
    </ThemeProvider>
    </>
  )
}

export default AppLayout
 