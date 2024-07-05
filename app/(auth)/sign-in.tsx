import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { images } from '@/constants/images'
import FormField from '@/components/form-field'
import Button from '@/components/button'
import { Link, useRouter } from 'expo-router'
import { getCurrentUser, signIn } from '@/lib/app-write'
import { SafeAreaViewContainer } from '@/components/safe-area-view-container'
import { useGlobalContext } from '@/store/global-provider'

const SignInScreen = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleTextForm = (key: string, value: string) => {
    setForm({
      ...form,
      [key]: value,
    })
  }

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields')
    }

    setIsSubmitting(true)

    try {
      const result = await signIn(form.email, form.password)

      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setIsLoggedIn(true)

      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaViewContainer>
      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View className="flex flex-col w-full justify-center h-full px-8 my-6">
          <Image source={images.logo} className="w-[115px] h-[35px]" resizeMode="contain" />
          <Text className="text-semibold font-psemibold mt-10 text-2xl text-white">
            Log in to Aora
          </Text>

          <FormField
            title="Email"
            placeholder="Enter your email"
            value={form.email}
            handleChangeText={(value: string) => handleTextForm('email', value)}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder="Enter your password"
            value={form.password}
            handleChangeText={(value: string) => handleTextForm('password', value)}
            otherStyles="mt-7"
          />

          <Button
            title="Sign in"
            onPress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-secondary">
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  )
}

export default SignInScreen
