import React, { useState, useEffect } from "react"
import * as R from "ramda"

import api from "../utils/api"

const UserAvatar = ({ user }) => {
  return <div className="UserAvatar">{user.avatar}</div>
}

const Place = ({ name, users }) => {
  return (
    <div className={`Place Place_${name}`}>
      <span className="Place-title">{name}</span>
      <div className="avatars-container">
        {users.map((user: any, i) => (
          <UserAvatar user={user} key={i} />
        ))}
      </div>
    </div>
  )
}

const Statuses = _props => {
  const [users, setUsers] = useState({})
  const getUsersByPlace = placeName => R.propOr([], placeName)(users)

  useEffect(() => {
    api.statuses().then(response => {
      console.log(response)
      const usersArray = response.data.users
      console.log(usersArray)
      const usersByPlace = R.groupBy(
        R.pathOr("unknown", ["status", "place", "name"]),
        usersArray
      )

      setUsers(usersByPlace)
    })
  }, [])

  return (
    <div className="status-container">
      <Place name="home" users={getUsersByPlace("home")} />
      <Place name="work" users={getUsersByPlace("work")} />
      <Place name="heading-home" users={getUsersByPlace("heading-home")} />
      <Place name="gym" users={getUsersByPlace("gym")} />
      <Place name="out" users={getUsersByPlace("out")} />
    </div>
  )
}

export default Statuses
