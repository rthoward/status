import React from "react"

import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import { useUser } from "../context/userContext"
import { useAuth } from "../context/authContext"

const LoginLink = () => {
  return <div></div>
}

const Menu = ({ user, logout }) => {
  return (
    <div>
      <NavDropdown.Item href="#">{user.email} - Profile</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={logout}>Log out</NavDropdown.Item>
    </div>
  )
}

export default ({ health }) => {
  const user = useUser()
  const { logout } = useAuth()

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">Status</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {user.isAuthenticated ? (
            <Menu user={user} logout={logout} />
          ) : (
            <LoginLink />
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
