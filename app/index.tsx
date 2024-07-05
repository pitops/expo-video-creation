import { Image, ScrollView, Text, View } from 'react-native'
import { images } from '@/constants/images'
import Button from '@/components/button'
import { StatusBar } from 'expo-status-bar'
import { Redirect, useRouter } from 'expo-router'
import { useGlobalContext } from '@/store/global-provider'
import { SafeAreaViewContainer } from '@/components/safe-area-view-container'

export default function Index() {
  const { isLoading, isLoggedIn } = useGlobalContext()
  const router = useRouter()

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />

  return (
    <SafeAreaViewContainer>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center h-full px-8">
          <Image source={images.logo} className="w-[130px] h-[84px]" resizeMode="contain" />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation: embark on a journey of limitless exploration with
            Aora
          </Text>

          <Button
            containerStyles="w-full mt-7"
            onPress={() => router.push('/sign-in')}
            title="Continue with Email"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaViewContainer>
  )
}
