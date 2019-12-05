import React from "react"
import { UserProvider } from "../context/userContext"
import { AuthProvider } from "../context/authContext"
import { statusesReducer, StatusesAction } from "./Statuses"
import { Status } from "../types"
import * as R from "ramda"

const buildStatus = (id, data = {}): any =>
  R.mergeDeepRight(
    {
      id: id,
      user_id: id,
      user: {
        id: id,
        email: "a@example.com",
        username: "a",
        avatar: "A",
        inserted_at: "",
        updated_at: ""
      },
      location: "home",
      inserted_at: "",
      updated_at: ""
    },
    data
  )

const withUser = component => {
  const user = {}

  return (
    <AuthProvider>
      <UserProvider value={{ data: user }}>{component}</UserProvider>
    </AuthProvider>
  )
}

describe("statusesReducer", () => {
  const initialState = {
    locations: [],
    statusesByLocation: undefined
  }

  test("SET_LOCATIONS", () => {
    const locations = [{ name: "home" }, { name: "work" }, { name: "school" }]
    const newState = statusesReducer(initialState, {
      type: StatusesAction.SET_LOCATIONS,
      payload: {
        locations
      }
    })

    expect(newState && newState.locations).toEqual(locations)
  })

  test("SET_STATUSES", () => {
    const statuses: Status[] = [
      buildStatus(1, { location: "home" }),
      buildStatus(2, { location: "home" }),
      buildStatus(3, { location: "work" }),
      buildStatus(4, { location: "school" })
    ]

    const newState = statusesReducer(initialState, {
      type: StatusesAction.SET_STATUSES,
      payload: {
        statuses
      }
    })

    const expected = {
      home: [statuses[0], statuses[1]],
      work: [statuses[2]],
      school: [statuses[3]]
    }

    expect(newState && newState.statusesByLocation).toEqual(expected)
  })

  test("UPDATE_STATUS", () => {
    const _initialState = {
      ...initialState,
      statusesByLocation: {
        home: [buildStatus(2, { location: "home" })],
        work: [buildStatus(1, { location: "work" })]
      }
    }

    const newStatus = buildStatus(3, { location: "work" })

    const newState = statusesReducer(_initialState, {
      type: StatusesAction.UPDATE_STATUS,
      payload: {
        status: newStatus
      }
    })

    expect(R.path(["statusesByLocation", "work"], newState)).toHaveLength(2)
  })

  test("UPDATE_STATUS when user has an existing status", () => {
    const _initialState = {
      ...initialState,
      statusesByLocation: {
        home: [buildStatus(2, { location: "home" })],
        work: [
          buildStatus(1, { location: "work" }),
          buildStatus(3, { location: "work" })
        ]
      }
    }

    const newStatus = buildStatus(3, { location: "home" })

    const newState = statusesReducer(_initialState, {
      type: StatusesAction.UPDATE_STATUS,
      payload: {
        status: newStatus
      }
    })

    expect(R.path(["statusesByLocation", "home"], newState)).toHaveLength(2)
    expect(R.path(["statusesByLocation", "work"], newState)).toHaveLength(1)
  })
})
