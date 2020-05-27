import React, { Component } from 'react'
import MainLayout from '../../../../components/layout/MainLayout'
import { Box, dialog, Breadcrumb } from '../../../../components'
import { Formik, Form, Field } from 'formik'
import { TextField, Select, ChooseFile } from '../../../../components/formik'
import { withAuth } from '../../../../services/auth'
import api from '../../../../services/webservice'
import { isEmpty, validateEmail, validateSizeInKb } from '../../../../util/utilities'
import { ROLES } from '../../../../util/constants'
import { getExhibitorID } from '../..'

export class ExhibitorList extends Component {

    static async getInitialProps(ctx) {
        try {
            const exhibitorID = getExhibitorID(ctx)
            const exhibitorStaffID = ctx.query.accountId
            const res = await api.getStaffDetail({ exhibitorStaffID }, ctx)
            const country = await api.getCountry(ctx)
            return {
                staffDetail: res.data.result,
                exhibitorStaffID,
                countries: country.data.result,
                exhibitorID
            }
        } catch (error) {
            return {
                error,
                staffDetail: {},
                exhibitorStaffID: "",
                countries: [],
                exhibitorID: ''
            }
        }
    }

    constructor(props) {
        super(props)
        this.formik = null
        this.delay = null
        this.state = {
            exhibitorStaffID: props.exhibitorStaffID,
            staffDetail: props.staffDetail,
            exhibitorID: props.exhibitorID
        }
    }

    loadStaffDetail = () => {
        const { exhibitorStaffID } = this.state
        api.getStaffDetail({ exhibitorStaffID }).then(res => {
            this.setState({ staffDetail: res.data.result })
        })
    }

    onEditStaff = (values) => {
        if (this.delay) {
            clearTimeout(this.delay)
            this.delay = null
        }
        this.delay = setTimeout(() => {
            const { exhibitorStaffID } = this.state
            api.editStaff({
                exhibitorStaffID,
                ...values,
                ...(values.imageProfile.length > 0 ? values.imageProfile[0] : { fileUrl: "", fileName: "", filePath: "" })
            }).then(() => {
                dialog.showSuccessToast("Saved")
            })
        }, 750)
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
                    dialog.showSuccessToast("Successfully uploaded")
                    this.formik.setFieldValue(fieldName, res.data.result)
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

    onEditEmail = () => {
        const { exhibitorStaffID } = this.state
        dialog.ajax({
            title: "Please enter your new email address.",
            inputType: 'email',
            onConfirm: (email) => api.sendStaffOTP({ email }).then(res => {
                const { ref_id } = res.data.result
                setTimeout(() => {
                    dialog.ajax({
                        title: "Please enter your OTP to verify your email",
                        inputType: 'text',
                        onConfirm: (otp) => api.checkStaffOTP({ email, otp }).then(res => {
                            api.changeStaffEmail({ otp, email, exhibitorStaffID }).then(() => {
                                setTimeout(() => {
                                    dialog.showDialogSuccess({
                                        message: 'Successfully changed.',
                                        showConfirmButton: false,
                                        onClose: () => api.getStaffDetail({ exhibitorStaffID }).then(res => {
                                            this.formik.setFieldValue('email', res.data.result.email)
                                        })
                                    })
                                }, 250)
                            })
                        })
                    })
                }, 250)
            })
        })
    }

    render() {

        const { staffDetail, exhibitorID } = this.state
        const { account } = this.props
        const { userFname, userLname, phone, email, position, companyName, countryID, imageProfile } = staffDetail

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Exhibitor's Staff</h1>
                </div>

                {account.roleName === ROLES.EXHIBITOR ? (
                    <Breadcrumb
                        links={[
                            {
                                href: '/exhibitor/[id]',
                                label: 'Detail',
                                as: `/exhibitor/${exhibitorID}`,
                                active: false
                            }
                            , {
                                href: '/',
                                label: 'Edit staff',
                                active: true
                            }
                        ]}
                    />
                ) : (
                        <Breadcrumb
                            links={[
                                {
                                    href: '/exhibitor',
                                    label: 'Exhibitors',
                                    active: false
                                }, {
                                    href: '/exhibitor/[id]',
                                    label: 'Detail',
                                    as: `/exhibitor/${exhibitorID}`,
                                    active: false
                                }
                                , {
                                    href: '/',
                                    label: 'Edit staff',
                                    active: true
                                }
                            ]}
                        />
                    )}

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <h4>Edit Staff Account</h4>

                            <Formik
                                initialValues={{
                                    firstName: userFname || "",
                                    lastName: userLname || "",
                                    phone: phone || "",
                                    email: email || "",
                                    position: position || "",
                                    countryID: countryID || "",
                                    companyName: companyName || "",
                                    imageProfile: imageProfile && imageProfile.fileUrl ? [{ ...imageProfile }] : []
                                }}
                                validateOnBlur={false}
                                validate={values => {
                                    const requires = ['email', 'firstName', 'lastName', 'position', 'phone', 'email', 'countryID', 'companyName']
                                    const errors = {}

                                    if (values['email'] && !validateEmail(values['email'])) {
                                        errors['email'] = 'Invalid email format.';
                                    }

                                    requires.forEach(field => {
                                        if (!values[field]) {
                                            errors[field] = 'Required';
                                        }
                                    })

                                    if (isEmpty(errors)) {
                                        this.onEditStaff(values)
                                    }

                                    return errors
                                }}

                            >
                                {(formik) => {
                                    this.formik = formik
                                    return (
                                        <Form>
                                            <div className="row">
                                                <div className="col-md-5 col-lg-4 mt-3">
                                                    <Field label="Profile Image" name="imageProfile" component={ChooseFile} className="input-group pl-0" onChange={this.handelChangeFile('imageProfile')} onRemove={this.onImageDelete} deleteMessage="Are you sure you want to delete your profile image?" />
                                                </div>
                                                <div className="col-md-7 col-lg-8" />
                                                <div className="col-lg-4 mt-3">
                                                    <Field name="firstName" label="First Name" component={TextField} placeholder="" required />
                                                </div>
                                                <div className="col-lg-4 mt-3">
                                                    <Field name="lastName" label="Last Name" component={TextField} placeholder="" required />
                                                </div>
                                                <div className="col-lg-4 mt-3">
                                                    <Field name="phone" label="Phone" component={TextField} placeholder="" required />
                                                </div>
                                                <div className="col-lg-4 mt-3">
                                                    <div style={{ position: 'relative' }}>
                                                        <Field name="email" label="Email" component={TextField} placeholder="" required disabled />
                                                        <i onClick={this.onEditEmail} className="fas fa-pen" style={{ position: 'absolute', right: 8, bottom: 10, cursor: 'pointer', color: '' }} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 mt-3">
                                                    <Field name="position" label="Position" component={TextField} placeholder="" required />
                                                </div>
                                                <div className="col-lg-4 mt-3">
                                                    <Field name="companyName" label="Company Name" component={TextField} placeholder="" required />
                                                </div>
                                                <div className="form-group col-lg-4 mt-3">
                                                    <Field name='countryID' label={'Country:'} required type="text" component={Select} options={this.props.countries} className="form-control" idFieldName="countryID" labelFieldName="nameEn" isMultiLang={false} />
                                                </div>
                                            </div>
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </Box>
                    </div>
                </div>


            </MainLayout>
        )
    }
}

export default withAuth(ExhibitorList, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.EXHIBITOR])