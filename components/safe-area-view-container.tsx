import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

interface SafeAreaViewContainerProps {
  children: React.ReactNode
}

export const SafeAreaViewContainer: React.FC<SafeAreaViewContainerProps> = ({ children }) => {
  return (
    <SafeAreaView style={{ backgroundColor: '#161622', height: '100%' }}>{children}</SafeAreaView>
  )
}
