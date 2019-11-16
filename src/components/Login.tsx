import React from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import { Link, useHistory, useLocation } from "react-router-dom"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"

import api from "../utils/api"
import { useAuth } from "../context/authContext"

export default _props => {
  const history = useHistory()
  const location = useLocation()
  const auth = useAuth()

  const {
    from: { pathname: redirectTo }
  } = location.state || { from: { pathname: "/" } }

  const initialValues = { email: "", password: "" }
  const onSubmit = ({ email, password }, actions) => {
    api.login({ email, password }).then(response => {
      if (response.ok && response.data) {
        const {
          data: { token: authToken, renew_token: renewToken }
        } = response.data
        actions.setSubmitting(false)
        auth.login({ email, authToken, renewToken })
        history.push(redirectTo || "/")
      } else if (response.data) {
        // mapErrors(response.data.error, actions)
      }
    })
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email()
      .required("Required"),
    password: Yup.string().required("Required")
  })

  return (
    <div className="register">
      <h1>Log in to Status</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {props => (
          <Form noValidate onSubmit={props.handleSubmit}>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  id="email"
                  isValid={props.touched.email && !props.errors.email}
                  isInvalid={props.touched.email && !!props.errors.email}
                  onChange={props.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.email}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  id="password"
                  isValid={props.touched.password && !props.errors.password}
                  isInvalid={props.touched.password && !!props.errors.password}
                  onChange={props.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            {props.status}
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <div>
        Don't have a Status account? <Link to="/register">Register</Link>
      </div>
    </div>
  )
}
