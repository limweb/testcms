import React, { Component } from 'react'
import { Formik, Form, Field } from 'formik'
import { TextField } from '../../components/formik/index'
import { validatePassword } from '../../util/utilities'
import Router from 'next/router'
import api from '../../services/webservice'
import { dialog } from '../../components'
import { PASSWORD } from '../../util/constants'

export class CreatePassword extends Component {


    static async getInitialProps(ctx) {
        return {
            tempToken: ctx.query.token
        }
    }


    constructor(props) {
        super(props)
        if (!props.tempToken) {
            Router.push('/404')
        }
    }

    render() {


        return (
            <div style={{ height: '100vh', paddingTop: '20vh', backgroundColor: 'rgb(248,249,252)' }}>

                <Formik
                    initialValues={{
                        password: "",
                        confirmPassword: ""
                    }}
                    validate={values => {
                        const required = ['password', 'confirmPassword']
                        const errors = {}

                        if (!validatePassword(values['password'])) {
                            errors['password'] = PASSWORD
                        }

                        if (values['confirmPassword'] !== values['password']) {
                            errors['confirmPassword'] = 'Your password and confirmation password do not match.'
                        }

                        required.forEach(field => {
                            if (!values[field]) {
                                errors[field] = 'Required'
                            }
                        })

                        return errors
                    }}
                    onSubmit={values => {
                        api.createPassword({
                            ...values,
                            token: this.props.tempToken
                        }).then(()=>{
                            dialog.showDialogSuccess({
                                onClose: ()=>Router.push('/login')
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
                                                <h1 className="h4 text-gray-900 mb-2">Create your password.</h1>
                                            </div>
                                            <div className="mb-3">
                                                <Field component={TextField} name="password" label="Password" type="password" required />
                                            </div>
                                            <div className="mb-3">
                                                <Field component={TextField} name="confirmPassword" label="Confirm Password" type="password" required />
                                            </div>
                                            <button onClick={formik.handleSubmit} type="button" className="btn btn-danger btn-user btn-block">Create</button>
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

export default CreatePassword
