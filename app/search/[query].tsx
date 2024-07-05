import React, { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaViewContainer } from '@/components/safe-area-view-container'
import { SearchInput } from '@/components/search-input'
import { EmptyState } from '@/components/empty-state'
import { Video } from '@/types/video'
import { useAppWrite } from '@/lib/use-app-write'
import { searchPosts } from '@/lib/app-write'
import { VideoCard } from '@/components/video-card'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { useLocalSearchParams } from 'expo-router'

const SearchScreen = () => {
  const { query } = useLocalSearchParams()
  const { data: posts, refetch } = useAppWrite<Video[]>(() => searchPosts(query as string), [])

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

  useEffect(() => {
    refetch().then(console.log)
  }, [query])

  return (
    <SafeAreaViewContainer>
      <FlatList<Video>
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="px-4">
            <Text className="font-pmedium text-sm text-gray-100">Search results</Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query as string} />
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

export default SearchScreen
