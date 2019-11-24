import React, { useEffect } from "react"
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
import { useUser } from "./context/userContext"

import "./App.css"
import { useAuth } from "./context/authContext"

const AuthenticatedApp = _props => {
  return (
    <div>
      <Container fluid>
        <Switch>
          <Route path="/">
            <Statuses />
          </Route>
        </Switch>
      </Container>
    </div>
  )
}

const UnauthenticatedApp = _props => {
  return (
    <div>
      <Container>
        <Switch>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route>
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Container>
    </div>
  )
}

const App = _props => {
  const user = useUser()
  const auth = useAuth()

  useEffect(() => {
    auth.tryRenew()
  }, [])

  return (
    <div>
      <Router>
        <Container fluid>
          <Header health={false} />
          {user && user.isAuthenticated ? (
            <AuthenticatedApp />
          ) : (
            <UnauthenticatedApp />
          )}
        </Container>
      </Router>
    </div>
  )
}

export default App
