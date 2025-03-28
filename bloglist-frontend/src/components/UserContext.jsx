import { createContext, useContext } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children, user }) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
)

export const useUser = () => useContext(UserContext)