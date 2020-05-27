import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import InfoNav from '../../components/layout/exhibition-info-nav'
import { Box, ImageDrop, dialog } from '../../components'
import api from '../../services/webservice'
import { withAuth } from '../../services/auth'
import { ROLES } from '../../util/constants'


export class BannerGallery extends Component {

    static async getInitialProps(ctx) {
        try {
            const res = await api.getImageGallery(ctx)
            return {
                oldImages: res.data.result
            }
        } catch (err) {
            return { oldImages: [], error: err }
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            oldImages: props.oldImages
        }
    }

    loadImages = () => {
        return api.getImageGallery().then(res => {
            this.setState({ oldImages: res.data.result })
        })
    }

    render() {

        const { oldImages } = this.state

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Fair Information</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <InfoNav currentTab="banner-gallery" />
                            <div className="col-md-12 p-3">
                                <ImageDrop
                                    oldFiles={oldImages}

                                    onSorted={sortedImgs => {
                                        api.editImageGallery({ imagesGallery: sortedImgs }).then(() => {
                                            dialog.showSuccessToast("Saved")
                                            this.loadImages()
                                        })
                                    }}

                                    onAddFile={({ acceptedFiles, uploadedFiles }) => {
                                        const fileToUpload = acceptedFiles.splice(0)
                                        dialog.showLoading()
                                        Promise.all(
                                            fileToUpload.map(file => {
                                                return api.uploadImage(file)
                                            })
                                        ).then(res => {
                                            const newImgs = [...uploadedFiles, ...res.map(({ data }) => {
                                                return { ...data.result[0], fileTitle: "", fileDescription: "" }
                                            })]
                                            api.editImageGallery({ imagesGallery: newImgs }).then(() => {
                                                this.loadImages()
                                                    .then(() => {
                                                        dialog.showSuccessToast("Successfully uploaded")
                                                    })
                                            })
                                        })
                                    }}

                                    onDelete={({ fileToDelete }) => {
                                        fileToDelete.imageGalleryID = fileToDelete.id
                                        dialog.showDialogConfirm({
                                            message: 'Are you sure you want to delete this image?',
                                            onConfirm: () => api.deleteImageGallery(fileToDelete).then(() => {
                                                this.loadImages()
                                                    .then(() => {
                                                        dialog.showSuccessToast("Successfully deleted")
                                                    })
                                            })
                                        })
                                    }}

                                    onMetaChange={({ file, uploadedFiles }) => {
                                        dialog.showModal({
                                            html: (<div className="" style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                                <div className="row mb-2">
                                                    <div className="col-lg-5 mb-2 text-left">
                                                        <div style={{ height: '100%' }} className="d-flex justify-content-center flex-column">
                                                            <div>
                                                                <label htmlFor="title">Title</label>
                                                                <input type="text"
                                                                    name="title"
                                                                    className="form-control"
                                                                    defaultValue={file.fileTitle}
                                                                    placeholder="Title" onChange={e => {
                                                                        file.fileTitle = e.target.value
                                                                    }} />
                                                            </div>

                                                            <div className="mt-4">
                                                                <label htmlFor="desc">Description</label>
                                                                <input type="text"
                                                                    name="desc"
                                                                    className="form-control"
                                                                    defaultValue={file.fileDescription}
                                                                    placeholder="Description" onChange={e => {
                                                                        file.fileDescription = e.target.value
                                                                    }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-7 mb-2 text-center">
                                                        <div>
                                                            <img src={file.fileUrl} className="preview-img-modal" />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>),
                                            onConfirm: () => {
                                                return api.editImageGallery({ imagesGallery: uploadedFiles }).then(() => {
                                                    setTimeout(() => {
                                                        dialog.showSuccessToast("Saved")
                                                    }, 250)
                                                })
                                            },
                                            onClose: () => this.loadImages()
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

export default withAuth(BannerGallery, [ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.SUPER_ADMIN])
