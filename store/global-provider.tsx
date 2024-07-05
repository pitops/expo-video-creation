import { createContext, FC, useContext, useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/app-write'
import { User } from '@/types/user'

interface State {
  isLoading: boolean
  isLoggedIn: boolean
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const GlobalContext = createContext<State>({
  isLoading: true,
  isLoggedIn: false,
  user: null,
  setUser: () => null,
  setIsLoggedIn: () => null,
})

export const useGlobalContext = () => useContext(GlobalContext)

interface GlobalProviderProps {
  children: React.ReactNode
}

export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (!res) return
        setIsLoggedIn(true)
        setUser(res)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <GlobalContext.Provider value={{ isLoading, isLoggedIn, user, setUser, setIsLoggedIn }}>
      {children}
    </GlobalContext.Provider>
  )
}
