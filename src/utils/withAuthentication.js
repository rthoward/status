import React, { useState, useEffect, useCallback } from "react"

const withAuthentication = Component => props => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const context = {
    user,
    isAuthenticated
  }

  useEffect(() => {
    const savedUser = JSON.parse(
      localStorage.getItem("__status_user__") || "null"
    )
    if (savedUser) {
      setUser(savedUser)
    }
  }, [user])

  useCallback(() => {
    console.log("user updated", user)
  }, [user])

  return <Component {...props} {...context} />
}
