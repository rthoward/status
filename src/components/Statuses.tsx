import React, { useState, useEffect } from "react"
import * as R from "ramda"

import api from "../utils/api"
import { useAuth } from "../context/authContext"

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
  const auth = useAuth()
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
