import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { images } from '@/constants/images'
import FormField from '@/components/form-field'
import Button from '@/components/button'
import { Link, useRouter } from 'expo-router'
import { createUser } from '@/lib/app-write'
import { SafeAreaViewContainer } from '@/components/safe-area-view-container'
import { useGlobalContext } from '@/store/global-provider'
import { User } from '@/types/user'

const SignUpScreen = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [form, setForm] = useState({
    username: '',
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
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields')
    }

    setIsSubmitting(true)

    try {
      const result = await createUser(form.email, form.password, form.username)
      setUser(result as User)
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
            Sign up to Aora
          </Text>

          <FormField
            title="Username"
            placeholder="Enter a username"
            value={form.username}
            handleChangeText={(value: string) => handleTextForm('username', value)}
            otherStyles="mt-10"
          />

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
            title="Sign up"
            onPress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Have an account already?</Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-secondary">
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  )
}

export default SignUpScreen
