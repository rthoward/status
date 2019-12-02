import React, { useState, useEffect } from "react"
import * as R from "ramda"
import { Socket } from "phoenix"

import api from "../utils/api"
import { useUser } from "../context/userContext"
import { Status } from "../types"

import Button from "react-bootstrap/Button"

const UserAvatar = ({ user }) => {
  return <div className="UserAvatar">{user.avatar}</div>
}

const Place = ({ name, statuses }) => {
  return (
    <div className={`Place Place_${name}`}>
      <span className="Place-title">{name}</span>
      <div className="avatars-container">
        {statuses.map((status: any, i) => (
          <UserAvatar user={status.user} key={i} />
        ))}
      </div>
    </div>
  )
}

const LocationPicker = ({ locations, updateStatus }) => {
  return (
    <div>
      {locations.map((locationName, i) => (
        <Button
          variant="primary"
          type="button"
          className="LocationPicker__button"
          onClick={() => updateStatus(locationName)}
          key={i}
        >
          {locationName}
        </Button>
      ))}
    </div>
  )
}

const Statuses = _props => {
  const locations = ["home", "work", "heading-home", "gym", "out"]
  const user = useUser()
  const [statusesByLocation, setStatusesByLocation] = useState<
    { [key: string]: Status[] } | undefined
  >(undefined)
  const getStatusesByLocation = location =>
    R.propOr([], location)(statusesByLocation)

  const updateLocation = location => {
    console.log("updating location to ", location)
    api.createStatus({ location })
  }

  useEffect(() => {
    api.statuses().then(response => {
      if (response.ok) {
        const statuses = response.data!.data.statuses
        const statusesByLocation = R.groupBy(R.prop("location"), statuses)
        setStatusesByLocation(statusesByLocation)
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

      const flatStatuses = R.flatten(R.values(statusesByLocation || {}))
      const updatedFlatStatuses = flatStatuses.map(status =>
        status.user_id == newStatus.user_id ? newStatus : status
      )
      const newStatusesByLocation = R.groupBy(
        R.prop("location"),
        updatedFlatStatuses
      )
      setStatusesByLocation(newStatusesByLocation)
    })

    return () => {
      socket.disconnect()
    }
  }, [user, statusesByLocation])

  return (
    <div className="status-container">
      <LocationPicker locations={locations} updateStatus={updateLocation} />
      {locations.map((locationName, i) => (
        <Place
          name={locationName}
          statuses={getStatusesByLocation(locationName)}
          key={i}
        />
      ))}
    </div>
  )
}

export default Statuses
