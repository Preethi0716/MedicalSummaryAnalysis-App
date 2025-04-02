import { TouchableOpacity, Text} from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyle, textStyle, isLoading }:any) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    className={`bg-red-100 rounded-xl min-h-[62px] justify-center items-center ${containerStyle} 
              ${isLoading ? 'opacity-50' :" "}`}
    disabled={isLoading}
    >
      <Text className={`text-primary font-semibold text-lg ${textStyle}`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton