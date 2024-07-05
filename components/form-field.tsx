import React, { FC, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { icons } from '@/constants/icons'

interface FormFieldProps {
  title: string
  value: string
  placeholder: string
  handleChangeText: (value: string) => void
  otherStyles?: string
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
}

const FormField: FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  keyboardType,
  handleChangeText,
  otherStyles,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`flex flex-col gap-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
