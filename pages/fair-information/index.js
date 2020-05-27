import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import InfoNav from '../../components/layout/exhibition-info-nav'
import { Box, dialog } from '../../components'
import { Formik, Field, Form } from 'formik'
import { TextField, FroalaEditor, ChooseFile, TextArea, DatePicker } from '../../components/formik'
import api from '../../services/webservice'
import { validateSizeInKb } from '../../util/utilities'
import FormikErrorFocus from 'formik-error-focus'
import { withAuth } from '../../services/auth'
import { ROLES } from '../../util/constants'

export class Information extends Component {

    static async getInitialProps(ctx) {

        try {
            const res = await api.getFairInfo(ctx)
            return {
                info: res.data.result
            }
        } catch (error) {
            return {
                error,
                info: {}
            }
        }

    }

    delay = null
    formik = null

    handelChangeFile = (fieldName) => (files) => {
        if (files.length > 0) {
            if (!validateSizeInKb(files[0].imageFile, 1000)) {
                dialog.showDialogWarning({
                    message: "Can not upload file greater than 1MB."
                })
            } else {
                dialog.showLoading()
                api.uploadImage(files[0].imageFile).then(res => {
                    this.formik.setFieldValue(fieldName, res.data.result)
                    dialog.showSuccessToast("Successfully uploaded")
                })
            }
        }
    }

    onImageDelete = (removedFile) => {
        api.deleteFile(removedFile[0]).then(() => {
            dialog.showSuccessToast("Successfully deleted")
        })
    }

    onSave = (values) => {
        dialog.showDialogConfirm({
            onConfirm: () => api.editFairInfo({
                ...values,
                fairdateStart: values.dateRange.from,
                fairdateEnd: values.dateRange.to,
                logo: values.logo[0]
            }).then(() => {
                setTimeout(() => {
                    dialog.showDialogSuccess({ showConfirmButton: false })
                }, 250);
            })
        })
    }

    saveOnChange = (values) => {
        if (this.delay) {
            clearTimeout(this.delay)
            this.delay = null
        }

        this.delay = setTimeout(() => {
            api.editFairInfo({
                ...values,
                fairdateStart: values.dateRange.from,
                fairdateEnd: values.dateRange.to,
                logo: values.logo[0]
            }).then(() => {
                setTimeout(() => {
                    dialog.showSuccessToast("Saved")
                }, 100)
            })
        }, 850)
    }

    onFroalaImageDelete = (fileMeta) => {
        api.deleteFile(fileMeta)
    }

    render() {

        const { info } = this.props

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Fair Information</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <InfoNav currentTab="info" />
                            <div className="col-md-12 p-3">
                                <Formik

                                    initialValues={{
                                        name: info.name || "",
                                        urlRegister: info.urlRegister || "",
                                        aboutFair: info.aboutFair || "",
                                        showGuideline: info.showGuideline || "",
                                        description: info.description || "",
                                        venue: info.venue || "",
                                        fairdateStart: "",
                                        fairdateEnd: "",
                                        dateRange: info.fairdateEnd && info.fairdateStart ?
                                            {
                                                from: info.fairdateStart,
                                                to: info.fairdateEnd
                                            } : {
                                                from: null,
                                                to: null
                                            },
                                        logo: info.logo && info.logo.fileUrl ? [{ ...info.logo }] : [],
                                        mainWebsiteUrl: info.mainWebsiteUrl || ""
                                    }}
                                    validateOnBlur={false}
                                    validate={(values) => {
                                        const errors = {}
                                        // const required = ['name', 'urlRegister', 'description', 'venue',]

                                        // if (!(values.dateRange.from && values.dateRange.to)) {
                                        //     errors.dateRange = "Required"
                                        // }

                                        // if (values.logo.length === 0) {
                                        //     errors.logo = "Required"
                                        // }
                                        // required.forEach(field => {
                                        //     if (!values[field]) {
                                        //         errors[field] = "Required"
                                        //     }
                                        // })
                                        this.saveOnChange(values)

                                        return errors
                                    }}

                                    onSubmit={(values) => {
                                        this.onSave(values)
                                    }}
                                >

                                    {(formik) => {
                                        this.formik = formik
                                        return (
                                            <Form>
                                                <div className="col-lg-6 mb-2">
                                                    <Field label="Logo" name="logo" component={ChooseFile} className="input-group pl-0" onChange={this.handelChangeFile('logo')} onRemove={this.onImageDelete} deleteMessage="Are you sure you want to delete Logo Image?"/>
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field label="Fair Name" name="name" component={TextField} />
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field label="Description" name="description" component={TextArea} className="form-control" />
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field label="Place/Location" name="venue" component={TextField} />
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field label="Date" mode="range" name="dateRange" component={DatePicker} />
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field name="mainWebsiteUrl" label="Main Website URL" component={TextField} placeholder="https://placeholder.com" />
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field name="urlRegister" label="URL Register" component={TextField} placeholder="https://placeholder.com" />
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field name="aboutFair" label="About Fair" component={FroalaEditor} onDeleteImage={this.onFroalaImageDelete} />
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field name="showGuideline" label="Show Guideline" component={FroalaEditor} onDeleteImage={this.onFroalaImageDelete} />
                                                </div>
                                                <FormikErrorFocus
                                                    offset={-40}
                                                    align={'top'}
                                                    focusDelay={0}
                                                    ease={'linear'}
                                                    duration={200}
                                                />
                                            </Form>
                                        )
                                    }}
                                </Formik>
                            </div>
                        </Box>
                    </div>

                </div>

            </MainLayout >
        )
    }
}

export default withAuth(Information, [ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.SUPER_ADMIN])
