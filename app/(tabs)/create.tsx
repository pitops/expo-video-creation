import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaViewContainer } from '@/components/safe-area-view-container'
import FormField from '@/components/form-field'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '@/constants/icons'
import Button from '@/components/button'
import * as ImagePicker from 'expo-image-picker'
import { prettyPrint } from '@/utils/pretty-print'
import { useRouter } from 'expo-router'
import { useGlobalContext } from '@/store/global-provider'
import { createVideo } from '@/lib/app-write'
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types'

enum PickerType {
  VIDEO = 'video',
  THUMBNAIL = 'thumbnail',
}

const CreateScreen = () => {
  const router = useRouter()
  const { user } = useGlobalContext()
  const [form, setForm] = useState<{
    title: string
    video: null | ImagePickerAsset
    thumbnail: null | ImagePickerAsset
    prompt: string
  }>({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  })
  const [uploading, setUploading] = useState(false)

  const openPicker = async (selectedType: PickerType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectedType === PickerType.VIDEO
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    })

    if (result.canceled) {
      console.log('canceled')
      return
    }

    if (selectedType === PickerType.VIDEO) {
      setForm({ ...form, video: result.assets[0] })
    } else {
      setForm({ ...form, thumbnail: result.assets[0] })
    }
  }

  const handleSubmit = async () => {
    //
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      return Alert.alert('Please fill all fields')
    }

    setUploading(true)

    try {
      await createVideo({
        ...form,
        userId: user?.$id!,
      })
      router.push('/home')
    } catch (error) {
      console.log(error)
      Alert.alert('An error occurred')
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
      })
      setUploading(false)
    }
  }

  prettyPrint(form)

  return (
    <SafeAreaViewContainer>
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-gray-100 font-pmedium">Upload Video</Text>

        <FormField
          title="Video title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-10">
          <Text className="text-base text-gray-100 font-pmedium">Upload Video</Text>

          <TouchableOpacity onPress={() => openPicker(PickerType.VIDEO)}>
            {form.video ? (
              <View className="w-full h-64 rounded-2xl">
                <Video
                  source={{ uri: form.video?.uri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode={ResizeMode.COVER}
                />
              </View>
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image source={icons.upload} className="w-1/2 h-1/2" resizeMode="contain" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Thumbnail image</Text>
          <TouchableOpacity onPress={() => openPicker(PickerType.THUMBNAIL)}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border border-black-200 flex-row gap-2">
                <Image source={icons.upload} className="w-5 h-5" resizeMode="contain" />
                <Text className="text-sm text-gray-100 font-pmedium">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you used to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <Button
          title="Submit & Publish"
          onPress={handleSubmit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaViewContainer>
  )
}

export default CreateScreen
