import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import InfoNav from '../../components/layout/exhibition-info-nav'
import { Box, FileDrop, dialog } from '../../components'
import api from '../../services/webservice'
import { withAuth } from '../../services/auth'
import { ROLES } from '../../util/constants'
export class EDirectory extends Component {

    static async getInitialProps(ctx) {

        try {
            const res = await api.getEdirectory(ctx)
            return {
                pdf: res.data.result
            }
        } catch (error) {
            return {
                pdf: [],
                error
            }
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            pdf: props.pdf
        }
    }

    loadPdf = () => {
        return api.getEdirectory().then(res => {
            this.setState({
                pdf: res.data.result
            })
        })
    }

    render() {

        const { pdf } = this.state

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Fair Information</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <InfoNav currentTab="e-directory" />
                            <div className="col-md-12 p-3">
                                <FileDrop
                                    oldFiles={pdf}
                                    onChange={({ acceptedFiles }) => {
                                        dialog.showLoading()
                                        const fileToUpload = acceptedFiles.splice(0)
                                        api.uploadPDFs(fileToUpload).then(res => {
                                            Promise.all(res.data.result.map(item => api.editEDirectory(item))).then(() => {
                                                this.loadPdf().then(()=>dialog.showSuccessToast("Successfully uploaded", 1000))
                                                
                                            })
                                        })
                                    }}

                                    onDelete={({ fileToDelete }) => {
                                        fileToDelete.eDirectoryID = fileToDelete.id
                                        dialog.showDialogConfirm({
                                            message:'Are you sure you wan to delete this file?',
                                            onConfirm: () => api.deleteEDirectory(fileToDelete).then(() => {
                                                dialog.showSuccessToast("Successfully deleted", 1000)
                                                this.loadPdf()
                                            })
                                        })
                                    }}
                                />
                            </div>
                        </Box>
                    </div>

                </div>

            </MainLayout>
        )
    }
}

export default withAuth(EDirectory, [ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.SUPER_ADMIN])
