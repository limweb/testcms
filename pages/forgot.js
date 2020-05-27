import React, { Component } from 'react'
import { Form, Field, Formik } from 'formik'
import api from '../services/webservice'
import { TextField } from '../components/formik'
import { validateEmail } from '../util/utilities'
import { dialog } from '../components'

export class Forgot extends Component {
    render() {
        return (
            <div style={{ height: '100vh', paddingTop: '20vh', backgroundColor: 'rgb(248,249,252)' }}>

                <Formik
                    initialValues={{
                        email: ""
                    }}
                    validate={values => {
                        const required = ['email']
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
                        api.sendForgotPassword(values).then(() => {
                            dialog.showDialogSuccess({
                                showConfirmButton: false,
                                message: 'Your password reset email has been sent.'
                            })
                        })
                    }}
                >
                    {formik => {

                        return (
                            <Form>
                                <div className="row d-flex justify-content-center align-items-center m-0">
                                    <div className="col-md-5 bg-white rounded shadow">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-2">Forgot your password?</h1>
                                            </div>
                                            <div className="mb-3">
                                                <Field component={TextField} name="email" label="Please enter your email address." type="email" />
                                            </div>
                                            <button onClick={formik.handleSubmit} type="button" className="btn btn-danger btn-user btn-block">Send</button>
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

export default Forgot
