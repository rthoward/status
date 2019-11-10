import React from "react"

import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import { useUser } from "../context/userContext"
import { useAuth } from "../context/authContext"

const LoginLink = () => {
  return <div></div>
}

const UserDropdown = ({ user, logout }) => {
  return (
    <NavDropdown title={user.email} id="basic-nav-dropdown">
      <NavDropdown.Item href="#">Profile</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={logout}>Log out</NavDropdown.Item>
    </NavDropdown>
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
            <UserDropdown user={user} logout={logout} />
          ) : (
            <LoginLink />
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
