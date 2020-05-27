import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, dialog, Breadcrumb } from '../../components'
import { Formik, Field, Form } from 'formik'
import { TextField, FroalaEditor } from '../../components/formik'
import api from '../../services/webservice'
import { withAuth } from '../../services/auth'
import { ROLES, ANNOUNCE_STATUS } from '../../util/constants'
import Router from 'next/router'
import { isEmpty } from '../../util/utilities'

export class ManageCampaign extends Component {

    static async getInitialProps(ctx) {

        try {
            const announcementID = ctx.query.id
            if (announcementID === 'create') {
                return {
                    announcementDetail: {},
                    announcementID
                }
            } else {
                const res = await api.getAnnouncementDetail({ announcementID }, ctx)
                return {
                    announcementDetail: res.data.result,
                    announcementID
                }
            }
        } catch (error) {
            return {
                error,
                announcementDetail: {},
                announcementID: ''
            }
        }
    }

    delay = null
    formik = null

    onDraft = () => {
        if (this.formik.isValid) {
            const values = this.formik.values
            api.createAnnouncement(values).then(() => {
                setTimeout(() => {
                    dialog.showDialogSuccess({
                        showConfirmButton: false,
                        message: 'Created Successfully',
                        onClose: () => Router.back()
                    })
                }, 250)
            })
        }
    }

    onCreateAndPublish = () => {
        if (this.formik.isValid) {
            const values = this.formik.values
            dialog.showDialogConfirm({
                message: 'Are you sure you want to create and publish this announcement?',
                onConfirm: () => new Promise(resolve => {
                    api.createAnnouncement(values).then((res) => {
                        api.publishAnnouncement({ announcementID: res.data.result.announcementID }).then(() => {
                            resolve(true)
                            setTimeout(() => {
                                dialog.showDialogSuccess({
                                    showConfirmButton: false,
                                    message: 'Published Successfully',
                                    onClose: () => Router.back()
                                })
                            }, 250)
                        })
                    })
                })
            })
        }
    }

    onSave = () => {
        if (this.formik.isValid) {
            const values = this.formik.values
            const { announcementID } = this.props
            dialog.showDialogConfirm({
                message: 'Are you sure you want to update this announcement?',
                onConfirm: () => api.editAnnouncement({ announcementID, ...values }).then(() => {
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            showConfirmButton: false,
                            message: 'Updated Successfully',
                            onClose: () => Router.back()
                        })
                    }, 250)
                })
            })
        }
    }

    onPublish = () => {
        const { announcementID } = this.props
        dialog.showDialogConfirm({
            message: 'Are you sure you want to publish this announcement?',
            onConfirm: () => api.publishAnnouncement({ announcementID }).then(() => {
                setTimeout(() => {
                    dialog.showDialogSuccess({
                        showConfirmButton: false,
                        message: 'Published Successfully',
                        onClose: () => Router.back()
                    })
                }, 250)
            })
        })
    }

    onDelete = () => {
        const { announcementID } = this.props
        dialog.showDialogConfirm({
            message: 'Are you sure you want to delete this announcement',
            onConfirm: () => api.deleteAnnouncement({ announcementID }).then(() => {
                setTimeout(() => {
                    dialog.showDialogSuccess({
                        showConfirmButton: false,
                        message: 'Deleted successfully',
                        onClose: () => Router.back()
                    })
                }, 250)
            })
        })
    }

    onFroalaImageDelete = (fileMeta) => {
        if (!isEmpty(fileMeta)) {
            api.deleteFile(fileMeta)
        }
    }

    render() {

        const { announcementDetail, announcementID } = this.props

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Manage Announcement</h1>
                </div>
                <Breadcrumb
                    links={[
                        {
                            href: '/announcement',
                            label: 'Announcement',
                            active: false
                        }, {
                            href: '/',
                            label: 'Manage',
                            active: true
                        }
                    ]}
                />

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <div className="col-md-12 p-3">
                                <Formik
                                    initialValues={{
                                        name: announcementDetail.name || "",
                                        shortDescription: announcementDetail.shortDescription || "",
                                        description: announcementDetail.description || ""
                                    }}
                                    validate={(values) => {
                                        const errors = {}
                                        const required = ['name']
                                        required.forEach(field => {
                                            if (!values[field]) errors[field] = "Required"
                                        })
                                        return errors
                                    }}
                                >

                                    {(formik) => {
                                        this.formik = formik
                                        return (
                                            <Form className="row">
                                                <div className="col-lg-12 mb-2">
                                                    <Field label="Announcement Name" name="name" component={TextField} />
                                                </div>
                                                <div className="col-lg-12 mb-1">
                                                    <Field label="Description" name="shortDescription" component={TextField} />
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field name="description" label="Announcement Detail" component={FroalaEditor} onDeleteImage={this.onFroalaImageDelete}/>
                                                </div>
                                                <div className="col-lg-12 mt-2">
                                                    {
                                                        announcementID === 'create' ?
                                                            (
                                                                <div className="d-flex justify-content-end align-items-center">
                                                                    <button onClick={this.onDraft} type="submit" className="btn btn-danger mr-1">Draft</button>
                                                                    <button onClick={this.onCreateAndPublish} type="submit" className="btn btn-danger">Publish</button>
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <button type="button" onClick={this.onDelete} className="btn btn-danger">Delete</button>
                                                                    <div>
                                                                        <button type="submit" onClick={this.onSave} className="btn btn-danger mr-1">Save</button>
                                                                        {announcementDetail.status === ANNOUNCE_STATUS.DRAFT ? (
                                                                            <button type="submit" onClick={this.onPublish} className="btn btn-danger">Publish</button>
                                                                        ) : ''}
                                                                    </div>
                                                                </div>
                                                            )
                                                    }
                                                </div>
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

export default withAuth(ManageCampaign, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF])
