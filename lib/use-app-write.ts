import React, { useEffect } from 'react'
import { Alert } from 'react-native'

export function useAppWrite<T>(fn: () => Promise<T | Error>, defaultValue: T) {
  const [data, setData] = React.useState<T>(defaultValue)
  const [isLoading, setIsLoading] = React.useState(true)

  async function fetchData() {
    try {
      const res = await fn()
      setData(res as T)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        Alert.alert('Error', error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData().then(console.log)
  }, [])

  const refetch = async () => await fetchData()

  return { refetch, data, isLoading }
}
