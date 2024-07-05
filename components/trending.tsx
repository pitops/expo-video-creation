import React from 'react'
import { FlatList, Image, ImageBackground, TouchableOpacity, View, ViewToken } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { CustomAnimation } from 'react-native-animatable'
import { Video as VideoType } from '@/types/video'
import { icons } from '@/constants/icons'
import { ResizeMode, Video } from 'expo-av'
import { AVPlaybackStatusSuccess } from 'expo-av/src/AV.types'
import { prettyPrint } from '@/utils/pretty-print'

interface TrendingProps {
  posts: VideoType[]
}

interface TrendingItemProps {
  activeItem: string
  item: VideoType
}

const zoomIn: CustomAnimation = {
  from: {
    transform: [{ scale: 0.9 }],
  },
  to: {
    transform: [{ scale: 1 }],
  },
}

const zoomOut: CustomAnimation = {
  from: {
    transform: [{ scale: 1 }],
  },
  to: {
    transform: [{ scale: 0.9 }],
  },
}

const TrendingItem = ({ activeItem, item }: TrendingItemProps) => {
  const [play, setPlay] = React.useState(false)

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}>
      {play ? (
        <View className="w-52 h-72 rounded-[33px] mt-3 bg-white/10">
          <Video
            source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 33,
            }}
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
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}>
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

export const Trending: React.FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = React.useState('')

  const viewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken<Video>[] }) => {
    console.log(viewableItems)
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => <TrendingItem activeItem={activeItem} item={item} />}
      horizontal
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
      contentOffset={{ x: 100, y: 0 }}
    />
  )
}
