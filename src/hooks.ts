import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import api from "./utils/api"
import config from "./config"

export const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

export const useHealth = config.useHealth
  ? (interval = 3000) => {
      const [health, setHealth] = useState(false)

      useEffect(() => {
        async function fetchHealth() {
          const response = await api.health()
          if (response.data && response.data.data.health) {
            setHealth(true)
          } else {
            setHealth(false)
          }
        }

        fetchHealth()
        const timer = setInterval(fetchHealth, interval)
        return () => {
          clearInterval(timer)
        }
      }, [health, interval])

      return health
    }
  : () => true
