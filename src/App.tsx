import React, { useEffect } from "react"
import { Socket } from "phoenix"
import Container from "react-bootstrap/Container"

import Register from "./components/Register"
import Login from "./components/Login"
import Header from "./components/Header"
import "./App.css"
import { useHealth } from "./hooks"
import { useUser } from "./context/userContext"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import config from "./config"

const Status = _props => {
  return (
    <div>
      <h1>Statuses</h1>
    </div>
  )
}

const PrivateRoute = ({ children, isAuthenticated, ...rest }) => {
  console.log("isAuthenticated", isAuthenticated)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}

const App = _props => {
  const user = useUser()
  const health = useHealth()

  console.log(config)

  useEffect(() => {
    const socketUrl = `${process.env.REACT_APP_WS_BASE}/socket`
    let socket = new Socket(socketUrl)
    socket.connect()
    let channel = socket.channel("status:update", {})
    channel
      .join()
      .receive("ok", resp => {
        console.log("Joined successfully", resp)
      })
      .receive("error", resp => {
        console.log("Unable to join", resp)
      })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div>
      <Router>
        <Header health={health} />
        <Container>
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute
              isAuthenticated={user && user.isAuthenticated}
              path="/"
            >
              <Status />
            </PrivateRoute>
          </Switch>
        </Container>
      </Router>
    </div>
  )
}

export default App
