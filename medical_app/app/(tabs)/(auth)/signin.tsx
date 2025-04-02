import { View, Text, ScrollView, Image, Alert, LogBox, ImageBackground, StyleSheet } from 'react-native'
import { useState,useEffect } from 'react'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../../constants'
import { Link, router } from 'expo-router'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useTheme } from '../../../context/ThemeProvider';
import { auth } from '@/lib/firebase'
import axios from 'axios'


const signin = () => {
  const [form, setform] = useState({
    email: '',
    password: ''
  })

  const { theme } = useTheme();
  const [text, setText] = useState('');

  const [isSubmitting, setisSubmitting] = useState(false)

  LogBox.ignoreAllLogs(true);
  LogBox.ignoreLogs(['Warning: ...']);
  
  axios.interceptors.response.use(
      (response) => response, 
      (error) => {
        console.error('Axios Error', error.message);  
        return Promise.resolve({});  
      }
    );

  
  const loginSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }
  
    setisSubmitting(true);

    
    try{  
        const session = await signInWithEmailAndPassword(auth, form.email, form.password);
        console.log('User signed in successfully:', session);

        router.replace('/(tabs)/(screens)/home')

    }catch (error : any){
        console.error('Sign-in failed:', error.message);
        Alert.alert("Error", (error as Error).message)
    }finally {
        setisSubmitting(false);
    }
    };
 


  return (
    <ImageBackground
        source={theme === 'dark' ? images.dark : images.background}
        style={styles.backgroundImage}
      >
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View className='w-full justify-center min-h-[85vh] px-6 my-4'>
          <Image source={images.medsync} resizeMode='contain'
           className='w-[175px] h-[90px]'/>
          <Text style={[styles.text, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Login to Expense Mapper
          </Text>
          <FormField
            title = "Email"
            value = {form.email}
            handleChangeText ={(e :any) => setform({...form,
              email : e
            })}
            otherStyles = {'mt-7'}
            keyboardType = 'email-address'
            inputStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
          <FormField
            title = "Password"
            value = {form.password}
            handleChangeText ={(e :any) => setform({...form,
              password : e
            })}
            otherStyles = {'mt-7'}
            isPasswordField={true} 
            inputStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
          <CustomButton 
            title = 'Sign-In'
            handlePress = {loginSubmit}
            containerStyle = 'mt-7'
            isLoading = {isSubmitting}
          />
          <View className='justify-center pt-5 flex-row gap-2'>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  )
}

export default signin

const styles = {
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover'
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  text: {
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center' as 'center',  
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
}