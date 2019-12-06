import React, { useEffect, useReducer } from "react"
import * as R from "ramda"
import { Socket } from "phoenix"

import api from "../utils/api"
import { useUser } from "../context/userContext"
import { Status, Location } from "../types"
import { useLongPress } from "../hooks"

export interface StatusesState {
  locations: Location[]
  statusesByLocation: { [key: string]: Status[] } | undefined
}

export enum StatusesAction {
  SET_LOCATIONS,
  SET_STATUSES,
  UPDATE_STATUS
}

export const statusesReducer = (state: StatusesState, action) => {
  switch (action.type) {
    case StatusesAction.SET_LOCATIONS:
      const { locations } = action.payload
      return { ...state, locations }
    case StatusesAction.SET_STATUSES:
      const statuses: Status[] = action.payload.statuses
      const statusesByLocation = R.groupBy(R.prop("location"), statuses)
      return { ...state, statusesByLocation }
    case StatusesAction.UPDATE_STATUS:
      const newStatus: Status = action.payload.status
      const flatStatuses = R.flatten(R.values(state.statusesByLocation || {}))
      const withoutOldStatus = R.reject(
        (s: Status) => s.user_id === newStatus.user_id,
        flatStatuses
      )
      const withNewStatus = R.append(newStatus, withoutOldStatus)
      const updatedFlatStatuses = R.uniqBy(s => s.user_id, withNewStatus)
      const newStatusesByLocation = R.groupBy(
        R.prop("location"),
        updatedFlatStatuses
      )
      return { ...state, statusesByLocation: newStatusesByLocation }
  }
}

const colors = ["#f7be87", "#8ca4b1", "#aacfaa", "#f9dca9", "#f9bfa5"]
const getColor = index => colors[index % colors.length]

const UserAvatar = ({ user }) => {
  return <div className="UserAvatar">{user.avatar}</div>
}

const Place = ({ name, statuses, height, color, updateLocation }) => {
  const updateLocation_ = useLongPress(() => updateLocation(name), 500)
  const style = {
    flexBasis: `${height}%`,
    backgroundColor: color
  }

  return (
    <div className={`Place Place_${name}`} style={style} {...updateLocation_}>
      <span className="Place-title">{name}</span>
      <div className="avatars-container">
        {statuses.map((status: any, i) => (
          <UserAvatar user={status.user} key={i} />
        ))}
      </div>
    </div>
  )
}

const Statuses = _props => {
  const user = useUser()
  const getStatusesByLocation = location =>
    R.propOr([], location)(state.statusesByLocation)

  const updateLocation = location => {
    api.createStatus({ location })
  }

  const initialState: StatusesState = {
    locations: [],
    statusesByLocation: undefined
  }
  // @ts-ignore
  const [state, dispatch] = useReducer(statusesReducer, initialState)

  useEffect(() => {
    api
      .locations()
      .then(response => {
        const locations = response.data!.data.locations
        dispatch({ type: StatusesAction.SET_LOCATIONS, payload: { locations } })
      })
      .then(() => api.statuses())
      .then(response => {
        if (response.ok) {
          const statuses = response.data!.data.statuses
          dispatch({ type: StatusesAction.SET_STATUSES, payload: { statuses } })
        }
      })
  }, [])

  useEffect(() => {
    const socketUrl = `${process.env.REACT_APP_WS_BASE}/socket`
    let socket = new Socket(socketUrl, { params: { token: user.socketToken } })
    socket.connect()
    let channel = socket.channel("status:update")
    channel
      .join()
      .receive("ok", resp => {
        console.log("joined")
      })
      .receive("error", resp => {
        console.log("failed to join", resp)
      })

    channel.on("update", message => {
      const newStatus: Status = message.status
      if (!newStatus) {
        return
      }
      dispatch({
        type: StatusesAction.UPDATE_STATUS,
        payload: { status: newStatus }
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [user])

  const placeHeight = 100 / state.locations.length

  return (
    <div className="Statuses-container">
      {state.locations.map((location, i) => (
        <Place
          name={location.name}
          height={placeHeight}
          color={getColor(i)}
          statuses={getStatusesByLocation(location.name)}
          key={i}
          updateLocation={updateLocation}
        />
      ))}
    </div>
  )
}

export default Statuses
