import { StyleSheet, Text, View, Switch, LogBox, ImageBackground,TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../context/ThemeProvider';
import { useState } from 'react';
import React from 'react';
import { router } from 'expo-router'
import Feather from 'react-native-vector-icons/Feather';
import { auth } from '@/lib/firebase'
import { images } from '../../../constants'; 

const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const logout = async () => {
    try {
      setIsSubmitting(true);
      await auth.signOut();
      router.replace('/(tabs)/(auth)/signin');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out.');
    } finally {
      setIsSubmitting(false);
    }
  };

  LogBox.ignoreAllLogs(true);
  LogBox.ignoreLogs(['Warning: ...']);

  return (
    <ImageBackground
        source={theme === 'dark' ? images.dark : images.background}
        style={styles.backgroundImage}
    >
    <View style={styles.container}>
      <Text style={theme === 'dark' ? styles.lightText : styles.darkText}>Theme</Text>
      <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
    </View>
    <TouchableOpacity style={styles.option} onPress={() => logout()}>
        <Feather name="log-out" size={20} color="#FF9800" />
        <Text style={[styles.optionText, theme === 'dark' ? styles.lightText : styles.darkText]}>Logout</Text>
    </TouchableOpacity>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  darkBackground: {
    backgroundColor: '#202123',
  },
  lightBackground: {
    backgroundColor: '#ffffff',
  },
  lightText: {
    color: '#ffffff',
  },
  darkText: {
    color: '#000000',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'white',
  },
});
