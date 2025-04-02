import { Text, View, Image, ScrollView, StyleSheet, LogBox, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants'; 
import useAuth from '@/context/useAuth';
import axios from 'axios';

const Medical = () => {
  const { user } = useAuth(); 

  LogBox.ignoreAllLogs(true);
  LogBox.ignoreLogs(['Warning: ...']);

  axios.interceptors.response.use(
    (response: any) => response,
    (error: { message: any }) => {
      console.error('Axios Error', error.message);
      return Promise.resolve({});
    }
  );

  // Redirect to home if the user is logged in
  if (user) {
    return <Redirect href="/(tabs)/(screens)/home" />;
  }

  return (
    <ImageBackground source={images.background} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.innerContainer}>
          
          
            <Image source={images.medsync} style={styles.logoImage} resizeMode='contain' />

            <Image source={images.medi} style={styles.cardsImage} resizeMode='contain' />

   
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/(auth)/signin')}
              activeOpacity={0.7}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Continue with Email</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <StatusBar backgroundColor='#161622' style='light' />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Medical;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  innerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 25,
    fontStyle: 'italic'
  },
  logoImage: {
    width: 275,
    height: 200,
  },
  cardsImage: {
    maxWidth: 550,
    width: '200%',
    height: 450,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    width: '70%',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
