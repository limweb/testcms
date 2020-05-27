import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, dialog, Breadcrumb } from '../../components'
import { Formik, Field, Form } from 'formik'
import { TextField, FroalaEditor, ChooseFile, TextArea, DatePicker } from '../../components/formik'
import api from '../../services/webservice'
import { withAuth } from '../../services/auth'
import { MultiSelect } from '../../components/formik/MultiSelect'
import { isEmpty } from '../../util/utilities'
import { ROLES } from '../../util/constants'

export class ManageCampaign extends Component {

    static async getInitialProps(ctx) {

        try {
            const campaignID = ctx.query.campaignId
            const res = await Promise.all([
                api.getCampaignDetail({ campaignID }, ctx),
                api.getAllExhibitors(ctx)
            ])
            const campaignDetail = res[0].data.result
            const exhibitors = res[1].data.result
            return {
                campaignDetail,
                exhibitors,
                campaignID
            }
        } catch (error) {
            return {
                error,
                campaignDetail: {},
                campaignID: '',
                exhibitors: []
            }
        }

    }

    delay = null
    formik = null

    handelChangeFile = (fieldName) => (files) => {
        if (files.length > 0) {
            dialog.showLoading()
            api.uploadImage(files[0].imageFile).then(res => {
                this.formik.setFieldValue(fieldName, res.data.result)
                dialog.showSuccessToast("Successfully uploaded")
            })
        }
    }

    onImageDelete = (removedFile) => {
        api.deleteFile(removedFile[0]).then(() => {
            dialog.showSuccessToast("Successfully deleted")
        })
    }

    saveOnChange = (values) => {
        if (this.delay) {
            clearTimeout(this.delay)
            this.delay = null
        }

        this.delay = setTimeout(() => {
            const { campaignID } = this.props
            api.editCampaign({
                campaignID,
                ...values,
                startDate: values.dateRange.from,
                endDate: values.dateRange.to,
                coverImage: values.coverImage.length > 0 ? values.coverImage[0] : { fileUrl: '', fieldName: '', filePath: '' }
            }).then(() => {
                setTimeout(() => {
                    dialog.showSuccessToast("Saved")
                }, 100)
            })
        }, 900)
    }


    onFroalaImageDelete = (fileMeta) => {
        if (!isEmpty(fileMeta)) {
            api.deleteFile(fileMeta)
        }
    }

    render() {

        const { campaignDetail, exhibitors } = this.props

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Manage Campaign</h1>
                </div>
                <Breadcrumb
                    links={[
                        {
                            href: '/campaign',
                            label: 'Campaign',
                            active: false
                        }, {
                            href: '/',
                            label: 'Edit',
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
                                        name: campaignDetail.name || "",
                                        about: campaignDetail.about || "",
                                        exhibitors: campaignDetail.exhibitors || [],
                                        coverImage: campaignDetail.coverImage && campaignDetail.coverImage.fileUrl ? [campaignDetail.coverImage] : [],
                                        dateRange: campaignDetail.startDate && campaignDetail.endDate ?
                                            {
                                                from: campaignDetail.startDate,
                                                to: campaignDetail.endDate
                                            } : {
                                                from: null,
                                                to: null
                                            },
                                        status: campaignDetail.status
                                    }}
                                    validateOnBlur={false}
                                    validate={(values) => {
                                        const errors = {}

                                        const required = ['name']

                                        if (!(values.dateRange.from && values.dateRange.to)) {
                                            errors.dateRange = "Required"
                                        }

                                        if (values.coverImage.length === 0) {
                                            errors.coverImage = "Required"
                                        }

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
                                >

                                    {(formik) => {
                                        this.formik = formik
                                        return (
                                            <Form className="row">
                                                <div className="col-lg-12 mb-2">
                                                    <Field label="Campaign Name" name="name" component={TextField} />
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field label="Date" mode="range" name="dateRange" component={DatePicker} />
                                                </div>
                                                <div className="col-lg-6 mb-2">
                                                    <Field label="Campaign Cover Image" name="coverImage" component={ChooseFile} className="input-group pl-0" onChange={this.handelChangeFile('coverImage')} onRemove={this.onImageDelete} deleteMessage="Are you sure you want to delete the campaign cover image?"/>
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field label="Exhibitors" name="exhibitors" component={MultiSelect} options={exhibitors.map(ex => ({ id: ex.exhibitorID, name: ex.name, image: ex.imgageLogo }))} imageField="image"/>
                                                </div>
                                                <div className="col-lg-12 mb-2">
                                                    <Field name="about" label="About Campaign" component={FroalaEditor} onDeleteImage={this.onFroalaImageDelete} />
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
