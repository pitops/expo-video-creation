import React from 'react'
import { Text, View } from 'react-native'

interface InfoBoxProps {
  containerStyles?: string
  titleStyles?: string
  title: string | number
  subtitle?: string
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  containerStyles,
  title,
  titleStyles,
  subtitle,
}) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>{title}</Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">{subtitle}</Text>
    </View>
  )
}
