import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import InfoNav from '../../components/layout/exhibition-info-nav'
import { Box, ButtonApp, dialog } from '../../components'
import { Formik, Field, Form } from 'formik'
import { ChooseFile } from '../../components/formik'
import api from '../../services/webservice'
import { withAuth } from '../../services/auth'
import { ROLES } from '../../util/constants'
export class cover extends Component {

    static async getInitialProps(ctx) {
        try {
            const res = await api.getFairCover(ctx)
            return {
                cover: res.data.result
            }
        } catch (error) {
            return { cover: {}, error }
        }
    }

    formik = null
    state = {
        loading: false
    }

    handelChangeFile = (fieldName) => (files) => {
        if (files.length > 0) {
            dialog.showLoading()
            api.uploadImage(files[0].imageFile).then(res => {
                dialog.showSuccessToast("Successfully uploaded")
                api.editFairCover(res.data.result[0]).then(() => {
                    this.formik.setFieldValue(fieldName, res.data.result)
                    setTimeout(() => {
                        dialog.showSuccessToast("Saved")
                    }, 250)
                })
            })
        }
    }

    onImageDelete = (removedFile) => {
        api.deleteFile(removedFile[0]).then(() => {
            api.editFairCover({ fileName: "", fileUrl: "", filePath: "" }).then(() => {
                dialog.showSuccessToast("Successfully deleted")
            })
        })
    }

    onSave = (values) => {
        dialog.showDialogConfirm({
            onConfirm: () => api.editFairCover({ ...values.cover[0] }).then(() => {
                setTimeout(() => {
                    dialog.showSuccessToast("Saved")
                }, 250);
            })
        })
    }

    render() {

        const { cover } = this.props

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Fair Information</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <InfoNav currentTab="cover" />
                            <div className="col-md-12 p-3">
                                <Formik
                                    initialValues={{
                                        cover: cover && cover.fileUrl ? [{ ...cover }] : []
                                    }}

                                    validate={(values) => {
                                        const errors = {}
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
                                                <Field label="Cover Image" name="cover" component={ChooseFile} isExample className="pl-0 col-xl-6 col-lg-6 col-md-8 col-sm-12 input-group" onChange={this.handelChangeFile('cover')} onRemove={this.onImageDelete} deleteMessage="Are you sure you want to delete the Cover Image?"/>
                                                
                                            </Form>
                                        )
                                    }}
                                </Formik>
                            </div>
                        </Box>
                    </div>

                </div>
            </MainLayout>
        )
    }
}

export default withAuth(cover, [ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.SUPER_ADMIN])
