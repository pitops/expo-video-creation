import React, { useEffect } from 'react'
import { FlatList, Image, RefreshControl, Text, View } from 'react-native'
import { SafeAreaViewContainer } from '@/components/safe-area-view-container'
import { images } from '@/constants/images'
import { SearchInput } from '@/components/search-input'
import { Trending } from '@/components/trending'
import { EmptyState } from '@/components/empty-state'
import { Video } from '@/types/video'
import { useAppWrite } from '@/lib/use-app-write'
import { getAllPosts, getLatestPosts } from '@/lib/app-write'
import { VideoCard } from '@/components/video-card'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { useGlobalContext } from '@/store/global-provider'

const HomeScreen = () => {
  const { user } = useGlobalContext()
  const { data: posts, refetch } = useAppWrite<Video[]>(getAllPosts, [])
  const { data: latestPosts } = useAppWrite<Video[]>(getLatestPosts, [])
  const [refreshing, setRefreshing] = React.useState(false)
  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

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

  return (
    <SafeAreaViewContainer>
      <FlatList<Video>
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="px-4">
            <View className="flex-row justify-between items-center my-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome back,</Text>
                <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
              </View>

              <View>
                <Image source={images.logoSmall} className="w-9 h-10" resizeMode="contain" />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">Latest videos</Text>
              <Trending posts={latestPosts} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="Be the first one to upload a video" />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaViewContainer>
  )
}

export default HomeScreen
