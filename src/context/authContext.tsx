import React, { useState } from "react"

import { AuthData } from "../interfaces"
import storage from "../utils/storage"

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
    setData({ user })
    storage.set("user", user)
  }

  const logout = () => {
    console.log("logging out")
    setData({ user: nullUser })
    storage.set("user", nullUser)
  }

  return <AuthContext.Provider value={{ data, login, logout }} {...props} />
}

const useAuth = (): any => React.useContext(AuthContext)

export { AuthProvider, useAuth }
