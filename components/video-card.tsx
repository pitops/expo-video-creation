import React, { useState } from 'react'
import { Video as VideoType } from '@/types/video'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { icons } from '@/constants/icons'
import { ResizeMode, Video } from 'expo-av'
import { AVPlaybackStatusSuccess } from 'expo-av/src/AV.types'
import { prettyPrint } from '@/utils/pretty-print'

interface VideoCardProps {
  video: VideoType
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [play, setPlay] = useState(false)

  return (
    <View className="px-4 mb-4">
      <View className="flex-row gap-3 items-start">
        <View className="gap-3 flex-row items-center flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: video.creator.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text className="font-psemibold text-sm text-white" numberOfLines={1}>
              {video.title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {video.creator.username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <View className="w-full h-60 rounded-xl mt-3">
          <Video
            source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 33,
            }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              prettyPrint(status)
              if ((status as AVPlaybackStatusSuccess).didJustFinish) {
                setPlay(false)
              }
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center">
          <Image
            source={{ uri: video.thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  )
}
