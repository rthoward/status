import React, { useState, useEffect } from "react"
import Card from "react-bootstrap/Card"
import CardColumns from "react-bootstrap/CardColumns"
import { formatDistance } from "date-fns"

import api from "../utils/api"

const StatusStacked = ({ status: { place, timestamp }, index }) => {
  const scale = 2.5
  const style: any = {
    zIndex: index,
    position: "absolute",
    marginTop: `${index * scale}rem`,
    marginLeft: `${index * scale}rem`,
    width: "8rem"
  }
  return (
    <Card className={`text-center Status-color_${place.color}`} style={style}>
      <Card.Body>{place.name}</Card.Body>
    </Card>
  )
}

const UserHistory = ({ user }) => {
  return (
    <div>
      <h2>History for {user.email}</h2>
      {user.statuses.map((status, i) => (
        <StatusStacked status={status} index={i} />
      ))}{" "}
    </div>
  )
}

const Status = ({ user, status: { place, timestamp } }) => {
  return (
    <Card>
      <Card.Header style={{ fontSize: "1.5rem" }}>
        {user.avatar} {user.name}
      </Card.Header>
      <Card.Body>
        <Card.Text>{place.name}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">
        {formatDistance(timestamp, new Date())} ago
      </Card.Footer>
    </Card>
  )
}

const BigEmojiStatus = ({ user, status: { place, timestamp }}) => {
  return (
    <Card>
      <Card.Header></Card.Header>
      <Card.Body>

      </Card.Body>
    </Card>
  )
}

const Statuses = _props => {
  const [users, setUsers] = useState({})

  useEffect(() => {
    api.statuses().then(response => {
      const usersArray = response.data.data.users
      const usersObj = usersArray.reduce(
        (prev, cur) => ({ ...prev, [cur.id]: cur }),
        {}
      )
      setUsers(usersObj)
    })
  }, [])

  return (
    <CardColumns>
      {Object.values(users).map((u: any, i) => (
        <Status user={u} status={u.status} key={i} />
      ))}
    </CardColumns>
  )
}

export default Statuses
