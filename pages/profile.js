import React, { Component } from 'react'
import MainLayout from '../components/layout/MainLayout'
import { Box, dialog } from '../components'
import { Formik, Form, Field } from 'formik'
import { validateSizeInKb, validatePassword } from '../util/utilities'
import { TextField, ChooseFile } from '../components/formik'
import api from '../services/webservice'
import { getAuth, setNewToken, setNewAccountData, withAuth } from '../services/auth'
import { PASSWORD, ROLES, ALL_ROLES } from '../util/constants'

export class Profile extends Component {


    static async getInitialProps(ctx) {

        try {
            const { account } = getAuth(ctx)
            const { imageProfile, userFname, userLname, accountID, role } = account
            const imageProfileDigest = imageProfile.split("/")

            const res = await api.getAllRole(ctx)
            return {
                allRoles: res.data.result,
                profile: {
                    role,
                    accountID,
                    userFname,
                    userLname,
                    imageProfile: {
                        fileName: imageProfileDigest.pop(),
                        fileUrl: imageProfile,
                        filePath: "virtual-event/images"
                    }
                }
            }
        } catch (error) {
            return {
                allRoles: [],
                error,
                profile: {}
            }
        }
    }



    handelChangeFile = (fieldName) => (files) => {
        if (files.length > 0) {
            if (!validateSizeInKb(files[0].imageFile, 1000)) {
                dialog.showDialogWarning({
                    message: "Can not upload file greater than 1MB."
                })
            } else {
                dialog.showLoading()
                api.uploadImage(files[0].imageFile).then(res => {
                    this.profileForm.setFieldValue(fieldName, res.data.result)
                    dialog.showSuccessToast("Successfully uploaded")
                })
            }
        }
    }

    onImageDelete = (removedFile) => {
        dialog.showLoading()
        api.deleteFile(removedFile[0]).then(() => {
            dialog.showSuccessToast("Successfully deleted")
        })
    }

    onSubmitProfile = (values) => {
        dialog.showDialogConfirm({
            message:'Are you sure you want to update this profile?',
            onConfirm: () => {
                const image = values.image.length > 0 ? values.image[0] : { fileName: "", fileUrl: "", filePath: "" }
                const params = {
                    ...values,
                    ...image
                }
                return api.editProfile(params).then(() => {
                    api.getAccountDetail({ accountID: this.props.profile.accountID }).then(res => {
                        const { email, userFname, userLname, role, imageProfile } = res.data.result
                        setNewAccountData({
                            imageProfile: imageProfile.fileUrl,
                            userFname,
                            userLname,
                            userEmail: email,
                            accountID: this.props.profile.accountID,
                            role,
                        })
                        setTimeout(() => {
                            dialog.showDialogSuccess({ 
                                message:'Profile successfully updated.',
                                showConfirmButton: false 
                            })
                        }, 250)
                    })
                })
            }
        })
    }

    onSubmitPassword = (values) => {
        dialog.showDialogConfirm({
            message:'Are you sure you want to change password?',
            onConfirm: () => {
                return api.changePassword(values).then((res) => {
                    setNewToken(res.data.result.token)
                    setTimeout(() => {
                        dialog.showDialogSuccess({ 
                            message:'Password successfully updated.',
                            showConfirmButton: false 
                        })
                        this.pass.resetForm()
                    }, 250)
                })
            }
        })
    }

    render() {

        const { profile, allRoles } = this.props

        const role = allRoles.find(r => {
            return r.id === profile.role
        })

        return (
            <MainLayout {...this.props}>


                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Your Profile</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>

                            <div className="row ">


                                <div className="col-lg-7 mb-2">
                                    <div className="border rounded p-2">
                                        <h5 className="font-weight-bold">Profile Information</h5>
                                        <Formik
                                            enableReinitialize
                                            initialValues={{
                                                firstName: profile.userFname || "",
                                                lastName: profile.userLname || "",
                                                image: profile.imageProfile && profile.imageProfile.fileUrl ? [{ ...profile.imageProfile }] : []
                                            }}
                                            validate={values => {

                                                const requires = ['firstName', 'lastName']
                                                let errors = {}

                                                requires.forEach(field => {
                                                    if (!values[field]) {
                                                        errors[field] = 'Required';
                                                    }
                                                })

                                                return errors;
                                            }}

                                            onSubmit={(value, actions) => {
                                                this.onSubmitProfile(value, actions)
                                            }}

                                        >
                                            {(formik) => {
                                                this.profileForm = formik
                                                return (
                                                    <Form>
                                                        <div className="row p-3">
                                                            <div className="col-lg-8 col-md-8">
                                                                <Field label="Profile Image" name="image" component={ChooseFile} className="input-group pl-0" onChange={this.handelChangeFile('image')} onRemove={this.onImageDelete} deleteMessage="Are you sure you want to delete this profile image?"/>
                                                            </div>
                                                            <div className="form-group col-lg-12">
                                                                <Field name='firstName' label={'First Name:'} required type="text" component={TextField} className="form-control" />
                                                            </div>
                                                            <div className="form-group col-lg-12">
                                                                <Field name='lastName' label={'Last Name:'} required type="text" component={TextField} className="form-control" />
                                                            </div>
                                                            <div className="form-group col-lg-12">
                                                                <button type="button" onClick={formik.handleSubmit} className="btn btn-danger mr-2">{"Save"}</button>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                )
                                            }}
                                        </Formik>
                                    </div>
                                </div>



                                {
                                    role.roleName !== 'Exhibitor' ? (
                                        <div className="col-lg-5 mb-2">
                                            <div className="border rounded p-2">
                                                <h5 className="font-weight-bold">Change Password</h5>
                                                <Formik
                                                    initialValues={{
                                                        oldPassword: "",
                                                        newPassword: "",
                                                        confirmPassword: ""
                                                    }}
                                                    validate={values => {
                                                        const required = ['newPassword', 'confirmPassword', "oldPassword"]
                                                        const errors = {}

                                                        if (!validatePassword(values['newPassword'])) {
                                                            errors['newPassword'] = PASSWORD
                                                        }

                                                        if (values['confirmPassword'] !== values['newPassword']) {
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
                                                        this.onSubmitPassword(values)
                                                    }}
                                                >
                                                    {formik => {
                                                        this.pass = formik
                                                        return (
                                                            <Form className="row p-3">
                                                                <div className=" form-group col-lg-12">
                                                                    <Field component={TextField} name="oldPassword" label="Current Password" type="password" required />
                                                                </div>
                                                                <div className=" form-group col-lg-12">
                                                                    <Field component={TextField} name="newPassword" label="New Password" type="password" required />
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <Field component={TextField} name="confirmPassword" label="Confirm New Password" type="password" required />
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <button onClick={formik.handleSubmit} type="button" className="btn btn-danger btn-user">Change</button>
                                                                </div>
                                                            </Form>
                                                        )
                                                    }}
                                                </Formik>
                                            </div>
                                        </div>
                                    ) : ''
                                }
                            </div>



                        </Box>
                    </div>

                </div>
            </MainLayout>
        )
    }
}

export default withAuth(Profile, ALL_ROLES)
