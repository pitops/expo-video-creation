import React from 'react'
import { Image, Text, View } from 'react-native'
import { images } from '@/constants/images'
import Button from '@/components/button'
import { useRouter } from 'expo-router'

interface EmptyStateProps {
  title: string
  subtitle: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => {
  const router = useRouter()
  return (
    <View className="justify-center items-center px-4">
      <Image source={images.empty} className="w-[270px] h-[215px]" resizeMode="contain" />
      <Text className="text-xl mt-2 font-psemibold text-white">{title}</Text>
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>

      <Button
        title="Create video"
        onPress={() => router.push('/create')}
        containerStyles="w-full my-5"
      />
    </View>
  )
}
