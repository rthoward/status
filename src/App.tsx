import React, { useEffect } from "react"
import { Socket } from "phoenix"
import Container from "react-bootstrap/Container"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"

import Register from "./components/Register"
import Login from "./components/Login"
import Header from "./components/Header"
import Statuses from "./components/Statuses"
import { useHealth } from "./hooks"
import { useUser } from "./context/userContext"

import "./App.css"
import { useAuth } from "./context/authContext"

const PrivateRoute = ({ children, isAuthenticated, ...rest }) => {
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
  const auth = useAuth()

  useEffect(() => {
    auth.tryRenew()
  }, [])

  useEffect(() => {
    const socketUrl = `${process.env.REACT_APP_WS_BASE}/socket`
    let socket = new Socket(socketUrl)
    socket.connect()
    let channel = socket.channel("status:update", {})
    channel
      .join()
      .receive("ok", resp => {
      })
      .receive("error", resp => {
      })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div>
      <Router>
        <Header health={health} />
        <Container fluid>
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
              <Statuses />
            </PrivateRoute>
          </Switch>
        </Container>
      </Router>
    </div>
  )
}

export default App
