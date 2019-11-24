import React, { useState, useEffect } from "react"
import * as R from "ramda"
import { Socket } from "phoenix"

import api from "../utils/api"
import { useAuth } from "../context/authContext"
import { useUser } from "../context/userContext"

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

const Statuses = _props => {
  const user = useUser()
  const [statusesByLocation, setStatusesByLocation] = useState({})
  const getStatusesByLocation = location =>
    R.propOr([], location)(statusesByLocation)

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
    console.log("joining")
    console.log(user)
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

    channel.on("meow", message => {
      console.log("meow handler", message)
    })

    return () => {
      socket.disconnect()
    }
  }, [user])

  return (
    <div className="status-container">
      <Place name="home" statuses={getStatusesByLocation("home")} />
      <Place name="work" statuses={getStatusesByLocation("work")} />
      <Place
        name="heading-home"
        statuses={getStatusesByLocation("heading-home")}
      />
      <Place name="gym" statuses={getStatusesByLocation("gym")} />
      <Place name="out" statuses={getStatusesByLocation("out")} />
    </div>
  )
}

export default Statuses
