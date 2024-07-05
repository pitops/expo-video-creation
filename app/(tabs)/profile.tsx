import React, { useEffect } from 'react'
import { FlatList, Image, TouchableOpacity, View } from 'react-native'
import { SafeAreaViewContainer } from '@/components/safe-area-view-container'
import { EmptyState } from '@/components/empty-state'
import { Video } from '@/types/video'
import { useAppWrite } from '@/lib/use-app-write'
import { getUserPosts, logout } from '@/lib/app-write'
import { VideoCard } from '@/components/video-card'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { useGlobalContext } from '@/store/global-provider'
import { icons } from '@/constants/icons'
import { InfoBox } from '@/components/info-box'
import { useRouter } from 'expo-router'

const ProfileScreen = () => {
  const router = useRouter()
  const { user, setUser, setIsLoggedIn } = useGlobalContext()
  const { data: posts } = useAppWrite<Video[]>(() => getUserPosts(user?.$id), [])

  useEffect(() => {
    async function configureAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          playsInSilentModeIOS: true, // Important: allow audio to play in silent mode
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          playThroughEarpieceAndroid: false,
        })
      } catch (e) {
        console.error('Failed to set audio mode', e)
      }
    }

    configureAudio().then(console.log)
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    setIsLoggedIn(false)
    router.replace('/sign-in')
  }

  return (
    <SafeAreaViewContainer>
      <FlatList<Video>
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity className="w-full items-end mb-10" onPress={handleLogout}>
              <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox title={user?.username ?? ''} containerStyles="mt-5" titleStyles="text-lg" />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox title="1.2k" subtitle="Followers" titleStyles="text-xl" />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="No videos found for this search query" />
        )}
      />
    </SafeAreaViewContainer>
  )
}

export default ProfileScreen
