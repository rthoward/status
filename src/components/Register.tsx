import React from "react"
import { Formik } from "formik"
import * as Yup from "yup"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import { useHistory, useLocation } from "react-router-dom"

import { mapErrors } from "../utils/forms"
import api from "../utils/api"
import { useAuth } from "../context/authContext"

export default _props => {
  const initialValues = { email: "", password: "", confirm_password: "" }
  const auth = useAuth()
  const history = useHistory()
  const location = useLocation()

  const {
    from: { pathname: redirectTo }
  } = location.state || { from: { pathname: "/" } }

  const onSubmit = (values, actions) => {
    api
      .register({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirm_password
      })
      .then(response => {
        if (response.ok && response.data) {
          const {
            token: authToken,
            renew_token: renewToken
          } = response.data.data
          auth.login({ email: values.email, authToken, renewToken })
          actions.setSubmitting(false)
          history.push(redirectTo || "/")
        } else if (response.data) {
          mapErrors(response.data.error.errors, actions)
        }
      })
      .finally(() => {
        actions.setSubmitting(false)
      })
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email()
      .required("Required"),
    password: Yup.string().required("Required"),
    confirm_password: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password"), null], "Passwords must match")
  })

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
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
