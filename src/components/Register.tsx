import React from "react"
import { Formik } from "formik"
import * as Yup from "yup"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Alert from "react-bootstrap/Alert"
import { useHistory, useLocation } from "react-router-dom"

import { mapErrors } from "../utils/forms"
import api from "../utils/api"
import { useAuth } from "../context/authContext"

export default _props => {
  const initialValues = {
    email: "",
    password: "",
    username: "",
    avatar: "",
    confirm_password: ""
  }
  const auth = useAuth()
  const history = useHistory()
  const location = useLocation()

  const {
    from: { pathname: redirectTo }
  } = location.state || { from: { pathname: "/" } }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email()
      .required("Required"),
    username: Yup.string().required("Required"),
    avatar: Yup.string()
      .length(2)
      .required("Required"),
    password: Yup.string().required("Required"),
    confirm_password: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password"), null], "Passwords must match")
  })

  const onSubmit = (values, actions) => {
    api
      .register({
        email: values.email,
        username: values.username,
        avatar: values.avatar,
        password: values.password,
        confirmPassword: values.confirm_password
      })
      .then(response => {
        if (response.ok) {
          const {
            token: authToken,
            renew_token: renewToken
          } = response.data!.data
          actions.setSubmitting(false)
          auth.login({ email: values.email, authToken, renewToken })
          history.push(redirectTo || "/")
        } else {
          mapErrors(validationSchema, response.data!.error.errors, actions)
        }
      })
  }

  return (
    <div className="register">
      <h1>Register for Status</h1>
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
              <Form.Label>Username</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  id="username"
                  isValid={props.touched.username && !props.errors.username}
                  isInvalid={props.touched.username && !!props.errors.username}
                  onChange={props.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.username}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Avatar</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  id="avatar"
                  isValid={props.touched.avatar && !props.errors.avatar}
                  isInvalid={props.touched.avatar && !!props.errors.avatar}
                  onChange={props.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.avatar}
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
            <Form.Group>
              <Form.Label>Confirm password</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  id="confirm_password"
                  isValid={
                    props.touched.confirm_password &&
                    !props.errors.confirm_password
                  }
                  isInvalid={
                    props.touched.confirm_password &&
                    !!props.errors.confirm_password
                  }
                  onChange={props.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.confirm_password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            {props.status && <Alert variant="danger">{props.status}</Alert>}
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
