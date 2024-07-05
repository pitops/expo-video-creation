import React, { FC } from 'react'
import { Text, TouchableOpacity } from 'react-native'

interface ButtonProps {
  title: string
  onPress: () => void
  containerStyles?: string
  textStyles?: string
  isLoading?: boolean
}

const Button: FC<ButtonProps> = ({ title, onPress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}>
      <Text className={`text-white font-psemibold text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button
