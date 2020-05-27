import React, { Component } from 'react'
import { Form, Field, Formik } from 'formik'
import { TextField } from '../components/formik'
import { validateEmail } from '../util/utilities'
import { dialog } from '../components'
import { login } from '../services/auth'
import Router from 'next/router'
import Link from 'next/link'

export class Login extends Component {

    onEnter = (e) => {
        if (e.keyCode === 13 && this.formik) {
            this.formik.handleSubmit()
        }
    }

    render() {
        return (
            <div style={{ height: '100vh', paddingTop: '15vh', width: '100%' }} className="bg-danger">

                <Formik
                    initialValues={{
                        email: "",
                        password: ""
                    }}
                    validate={values => {
                        const required = ['email', 'password']
                        const errors = {}

                        if (values['email'] && !validateEmail(values['email'])) {
                            errors['email'] = 'Invalid email format.'
                        }

                        required.forEach(field => {
                            if (!values[field]) {
                                errors[field] = 'Required'
                            }
                        })

                        return errors
                    }}
                    onSubmit={values => {
                        login(values).then((redirectPath) => {
                            window.location.href = redirectPath
                        })
                    }}
                >
                    {formik => {
                        this.formik = formik
                        return (
                            <Form onKeyUp={this.onEnter}>
                                <div className="row d-flex justify-content-center align-items-center m-0">
                                    <div className="col-md-5 bg-white rounded shadow">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h2 text-gray-900 mb-4">Virtual Event CMS</h1>
                                            </div>
                                            <div className="mb-3">
                                                <Field component={TextField} name="email" label="Email" type="email" />
                                            </div>
                                            <div className="mb-3">
                                                <Field component={TextField} name="password" label="Password" type="password" />
                                            </div>
                                            <div className="text-center">
                                                <button onClick={formik.handleSubmit} type="button" style={{ borderRadius: '25px' }} className="btn btn-danger btn-user col-md-5">Login</button>
                                            </div>
                                            <div className="text-center mt-3">
                                                <Link href="/forgot">
                                                    <a>Forgot password</a>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>

            </div>
        )
    }
}

export default Login