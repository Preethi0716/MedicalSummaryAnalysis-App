import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react'
import React from 'react'
import { icons, images } from '../constants'

const FormField = ({ title, value, placeHolder, handleChangeText, otherStyles, isPasswordField = false, ...props}:any) => {
    const [showPassword, setshowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-black-100 font-pmedium'>{title}</Text>
      <View className='w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl 
      focus:border-secondary items-center justify-center flex-row'>
        <TextInput
            className=' flex-1 text-black font-semibold text-base'
            value={value}
            placeholder={placeHolder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={isPasswordField && !showPassword} 
          {...props}
        />

        {(title === 'Password' || title === 'Re-Enter Password') && 
            <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
                <Image 
                    source={!showPassword ? icons.eye : icons.eyeHide}
                    className='w-6 h-6'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default FormField