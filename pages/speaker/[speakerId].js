import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, dialog } from '../../components'
import { withAuth } from '../../services/auth'
import { Form, Field, Formik } from 'formik'
import { ChooseFile, TextField, Select, TextArea } from '../../components/formik'
import api from '../../services/webservice'
import { isEmpty } from '../../util/utilities'
import Router from 'next/router'
import { ROLES } from '../../util/constants'


export class SpeakerDetail extends Component {

    static async getInitialProps(ctx) {
        try {

            const speakerID = ctx.query.speakerId
            // const res = await api.getSpeakerDetail({ speakerID }, ctx)

            return {
                speakerID,
                speakerDetail: {}//res[0].data.result
            }
        } catch (error) {
            return {
                error,
                speakerID: "",
                speakerDetail: {}
            }
        }
    }

    constructor(props) {
        super(props)
        const { speakerID, speakerDetail } = props
        this.formikInfo = null
        this.delay = null
        this.state = {
            speakerID, speakerDetail
        }
    }

    handelChangeFile = (fieldName) => (files) => {
        if (files.length > 0) {
            dialog.showLoading()
            api.uploadImage(files[0].imageFile).then(res => {
                this.formikInfo.setFieldValue(fieldName, res.data.result)
                dialog.showSuccessToast("Successfully uploaded")
            })
        }
    }

    onImageDelete = (removedFile) => {
        api.deleteFile(removedFile[0]).then(() => {
            dialog.showSuccessToast("Successfully deleted")
        })
    }

    onFroalaImageDelete = (fileMeta) => {
        api.deleteFile(fileMeta)
    }

    loadSpeakerDetail = () => {
        const { speakerID } = this.state
        return Promise.all([
            api.getSpeakerDetail({ speakerID })
        ]).then((res) => {
            this.setState({
                speakerDetail: res[0].data.result
            })
        })
    }

    onDelete = () => {
        const { speakerID } = this.state
        dialog.showDialogConfirm({
            onConfirm: () => {
                return api.deleteSpeaker({ speakerID }).then(() => {
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            showConfirmButton: false,
                            onClose: () => Router.back()
                        })
                    }, 250)
                })
            }
        })
    }

    saveOnChange = (values) => {
        if (this.delay) {
            clearTimeout(this.delay)
            this.delay = null
        }

        this.delay = setTimeout(() => {
            api.editSpeaker({
                ...values,
                imageProfile: values.imageProfile[0] || { fileUrl: '', fileName: '', filePath: '' }
            }).then(() => {
                setTimeout(() => {
                    dialog.showSuccessToast("Save")
                }, 100)
            })
        }, 1250)
    }


    render() {

        const { speakerID, speakerDetail } = this.state
        const {
            firstName, lastName, about, title, company, position, imageProfile
        } = speakerDetail

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Speaker</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <h4>Edit Speaker</h4>
                            <Formik

                                initialValues={{
                                    speakerID: speakerID || "",
                                    firstName: firstName || "",
                                    lastName: lastName || "",
                                    title: title || "",
                                    company: company || "",
                                    position: position || "",
                                    imageProfile: imageProfile && imageProfile.fileUrl ? [{ ...imageProfile }] : [],
                                    about: about || ""
                                }}
                                validateOnBlur={false}
                                validate={(values) => {

                                    const errors = {}
                                    const required = ['firstName', 'lastName', 'speakerID', 'title']

                                    required.forEach(field => {
                                        if (!values[field]) {
                                            errors[field] = "Required"
                                        }
                                    })

                                    if (isEmpty(errors)) {
                                        this.saveOnChange(values)
                                    }

                                    return errors
                                }}

                                onSubmit={(values) => {

                                }}
                            >

                                {(formik) => {

                                    this.formikInfo = formik

                                    return (
                                        <Form className="row">
                                            <div className="col-lg-12 mb-3">
                                                <Field label="Profile Image" name="imageProfile" component={ChooseFile} className="input-group pl-0 col-lg-3 col-md-4" onChange={this.handelChangeFile('imageProfile')} onRemove={this.onImageDelete} />
                                            </div>

                                            <div className="col-lg-2 mb-2">
                                                <Field label="Title" name="title" component={Select} required options={[{ value: 'Ms.' }, { value: 'Mrs.' }, { value: 'Mr.' }]} idFieldName="value" labelFieldName="value" isMultiLang={false} />
                                            </div>

                                            <div className="col-lg-5 mb-2">
                                                <Field label="First Name" name="firstName" component={TextField} required />
                                            </div>

                                            <div className="col-lg-5 mb-2">
                                                <Field label="Last Name" name="lastName" component={TextField} required />
                                            </div>

                                            <div className="col-lg-6 mb-2">
                                                <Field label="Company" name="company" component={TextField} />
                                            </div>

                                            <div className="col-lg-6 mb-2">
                                                <Field label="Position" name="position" component={TextField} />
                                            </div>

                                            <div className="col-lg-12 mb-3">
                                                <Field name="about" label="About" component={TextArea} className="form-control" />
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


export default withAuth(SpeakerDetail, [ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.SUPER_ADMIN])
