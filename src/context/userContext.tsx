import React from "react"

import { useAuth } from "./authContext"

const UserContext = React.createContext(undefined)

function UserProvider(props) {
  const {
    data: { user }
  } = useAuth()
  return <UserContext.Provider value={user} {...props} />
}

const useUser: any = () => React.useContext(UserContext)

export { UserProvider, useUser }
