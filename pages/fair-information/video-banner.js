import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import InfoNav from '../../components/layout/exhibition-info-nav'
import { Box, ButtonApp, dialog } from '../../components'
import { Formik, Field, Form } from 'formik'
import { TextField } from '../../components/formik'
import api from '../../services/webservice'
import { YOUTUBE_URL, ROLES } from '../../util/constants'
import { withAuth } from '../../services/auth'
export class VideoBanner extends Component {


    static async getInitialProps(ctx) {
        try {
            const res = await api.getVideoBanner(ctx)
            return {
                videoUrl: res.data.result.videoUrl
            }
        } catch (error) {
            return { videoUrl: "", error }
        }
    }

    onSave(values) {
        dialog.showDialogConfirm({
            message:'Are you sure you want to save the Video Banner?',
            onConfirm: () => api.editVideoBanner(values).then(() => {
                setTimeout(() => {
                    dialog.showDialogSuccess({
                        message:'Successfully saved',
                        showConfirmButton: false
                    })
                }, 250);
            })
        })
    }

    render() {

        const { videoUrl } = this.props
        
        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Fair Information</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <InfoNav currentTab="video-banner" />
                            <div className="col-md-12 p-3">
                                <Formik
                                    initialValues={{
                                        videoUrl: videoUrl || "",
                                    }}

                                    validate={(values) => {
                                        const errors = {}
                                        const require = []

                                        require.forEach(req => {
                                            if (!values[req]) {
                                                errors[req] = "Required"
                                            }
                                        })

                                        return errors
                                    }}

                                    onSubmit={(values) => {
                                        this.onSave(values)
                                    }}
                                >

                                    {(formik) => {

                                        return (
                                            <Form>
                                                <Field name="videoUrl" label="Youtube Video ID" component={TextField} placeholder="" />
                                                <div className="">
                                                    <iframe style={{ width: '80%', height: 480, marginTop: 16 }} src={YOUTUBE_URL + formik.values['videoUrl']} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </div>
                                                <div className="mt-3">
                                                    <ButtonApp isLoading={false} onClick={formik.handleSubmit} className="btn-danger px-3" >Save</ButtonApp>
                                                </div>
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

export default withAuth(VideoBanner, [ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.SUPER_ADMIN])
