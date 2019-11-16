import React, { useState } from "react"

import { AuthData } from "../interfaces"
import storage from "../utils/storage"
import api from "../utils/api"

const nullUser = {
  email: "",
  isAuthenticated: false,
  authToken: "",
  renewToken: ""
}
const defaultData: AuthData = {
  user: storage.get("user", nullUser)
}
const AuthContext: any = React.createContext(defaultData)

function AuthProvider(props) {
  // Commented-out this useAsync call because reload() isn't working the way I'd expect

  // const [firstAttemptFinished, setFirstAttemptFinished] = React.useState(false)
  // const {
  //   data = defaultData,
  //   error,
  //   isRejected,
  //   isPending,
  //   isSettled,
  //   reload
  // } = useAsync({
  //   promiseFn: bootstrapAppData
  // })

  // React.useLayoutEffect(() => {
  //   if (isSettled) {
  //     setFirstAttemptFinished(true)
  //   }
  // }, [isSettled])

  // if (!firstAttemptFinished) {
  //   if (isPending) {
  //     return <div>loading</div>
  //   }
  //   if (isRejected) {
  //     return (
  //       <div>
  //         <p>Uh oh... There's a problem. Try refreshing the app.</p>
  //         <pre>{error && error.message}</pre>
  //       </div>
  //     )
  //   }
  // }

  const [data, setData] = useState(defaultData)

  const login = ({ email, authToken, renewToken }) => {
    const user: any = { email, authToken, renewToken, isAuthenticated: true }
    storage.set("user", user)
    api.setAuthHeader({ authToken })
    setData({ user })
  }

  const logout = () => {
    setData({ user: nullUser })
    storage.set("user", nullUser)
  }

  const tryRenew = () => {
    const { user } = data

    if (user && user.renewToken) {
      api.renew({ renewToken: user.renewToken }).then(response => {
        console.log(response)
        if (response.ok) {
          const { token, renew_token } = response.data.data
          const updatedUser = {
            ...user,
            authToken: token,
            renewToken: renew_token
          }
          setData({ user: updatedUser })
          storage.set("user", updatedUser)
          console.log("Renewed session.")
        } else {
          console.log("Failed to renew session.")
          logout()
        }
      })
    } else {
      console.log("No active session.")
      logout()
    }
  }

  return (
    <AuthContext.Provider
      value={{ data, login, logout, tryRenew }}
      {...props}
    />
  )
}

const useAuth = (): any => React.useContext(AuthContext)

export { AuthProvider, useAuth }
