import React, { Component, useState, useEffect } from 'react'
import ExhibitorNav from '../../../components/layout/exhibitor-nav'
import MainLayout from '../../../components/layout/MainLayout'
import { Box, FroalaView, dialog, JqModal, Breadcrumb } from '../../../components'
import { useDropzone } from 'react-dropzone'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { Formik, Form, Field } from 'formik'
import { FroalaEditor, TextField, ChooseFile, Select } from '../../../components/formik'
import { withAuth } from '../../../services/auth'
import * as THREE from 'three/build/three'
import api from '../../../services/webservice'
import { ROLES } from '../../../util/constants'
import { getExhibitorID } from '..'

function PreviewItem(props) {
    const { file, onDelete, onEdit } = props
    const { imagePanoramaID, fileUrl, fileName } = file
    const deleteFileClick = () => onDelete({ fileToDelete: file })
    const editClick = () => onEdit(file)
    return (
        <div style={thumb} key={imagePanoramaID}>
            <div style={thumbInner}>
                <img
                    src={fileUrl}
                    style={img}
                    id={file.imagePanoramaID}
                    alt={fileName || 'PanoramaImage'}
                />
                <div onClick={deleteFileClick} style={deletes}><i className="fas fa-times"></i></div>
                <div onClick={editClick} style={view}><i className="fas fa-cog"></i></div>
            </div>
        </div>
    )
}

const SortableItem = sortableElement(({ value }) => <PreviewItem {...value} />)
const SortableContainer = sortableContainer(({ children }) => <div>{children}</div>)

//IMAGE DROP ZONE
function ImageDrop(props) {

    const { oldFiles = [], onAddFile = () => { }, onSorted = () => { }, onDelete = () => { }, onEdit = () => { } } = props
    const [uploadedFiles, setUploadedFiles] = useState(oldFiles)
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: `image/gif, image/jpeg, image/png, image/jpg`,
        multiple: false
    })

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const sortedImgs = arrayMove(uploadedFiles, oldIndex, newIndex)
        setUploadedFiles([...sortedImgs])
        onSorted(sortedImgs)
    }

    const previewList = []

    previewList.push(...uploadedFiles.map((file, index) => {
        return (
            <SortableItem disabled={false} key={file.imagePanoramaID} index={index} value={{ file, onDelete, onEdit }} />
        )
    }))

    if (acceptedFiles.length > 0) {
        onAddFile({ acceptedFiles, uploadedFiles })
    }

    useEffect(() => {
        setUploadedFiles(oldFiles)
    }, [oldFiles])

    return (
        <div className="row mb-3">
            <div {...getRootProps({ className: 'dropzone col-md-5 d-flex justify-content-center align-items-center flex-column' })}>
                <input {...getInputProps()} />
                <p><i className="fas fa-cloud-download-alt" style={{ fontSize: 36 }}></i></p>
                <p>Drag & drop images here or click to select images</p>
            </div>
            <div className="col-md-7">
                <div className="jumbotron jumbotron-fluid p-2 rounded m-0 h-100">
                    {uploadedFiles.length > 0 ? (
                        <SortableContainer onSortEnd={onSortEnd} axis="xy" distance={2}>
                            {previewList}
                        </SortableContainer>
                    ) : (
                            <div className="d-flex justify-content-center align-items-center flex-column p-2">
                                <p><i className="fas fa-images" style={{ fontSize: 42 }}></i></p>
                                <h4>No Image</h4>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}







let infoModal = null
let linkModal = null
let tempViewer = null
let infoSpotFormik = null
const emptyInfoForm = { infoSpotID: "", name: "", icon: [], scale: 300, html: "", positionX: 0, positionY: 0, positionZ: 0, delta: 100 }
const emptyLinkForm = { linkSpotID: "", panoramaLinkID: "", name: "", positionX: 0, positionY: 0, positionZ: 0 }
let currentParanoramaID = ""

//PANORAMA EDITOR VIEW
function PanoramaEditorView(props) {

    const { style, className, panoramaList, loadPanoramas, data, selectedPanoramaID, setSelectedPanoramaID } = props
    const { imagePanoramaID, exhibitorID, sequence, name, fileName, filePath, fileUrl, infoSpots, startSpots, linkSpots } = data


    const containerId = `panorama-container`
    const hideContainerId = `panorama-hide-container`

    const [positionMenu, setPositionMenu] = useState({ x: 0, y: 0 })
    const [showRightMenu, setShowRightMenu] = useState(false)
    const [panoramaClickPosition, setPanoramaClickPosition] = useState(null)
    const [linkForm, setLinkForm] = useState(emptyLinkForm)
    const [infoForm, setInfoForm] = useState(emptyInfoForm)
    const [panoramaLinkOptions, setPanoramaLinkOptions] = useState([])
    const [isPointing, setIsPointing] = useState(false)

    currentParanoramaID = imagePanoramaID

    const infoSpotList = []
    panoramaList.forEach(pano => {
        infoSpotList.push(...pano.infoSpots)
    })


    const onCreateLinkSpot = () => {
        if (linkModal) {
            setLinkForm({
                ...emptyLinkForm,
                ...{
                    positionX: panoramaClickPosition.x,
                    positionY: panoramaClickPosition.y,
                    positionZ: panoramaClickPosition.z
                }
            })
            setShowRightMenu(false)
            api.getPanoramaForLink({ imagePanoramaID, exhibitorID }).then(res => {
                setPanoramaLinkOptions(res.data.result)
                setTimeout(() => {
                    linkModal.show()
                }, 100)
            })
        }
    }

    const onCreateInfoSpot = () => {
        if (infoModal) {
            setShowRightMenu(false)
            setInfoForm({
                ...emptyInfoForm,
                ...{
                    positionX: panoramaClickPosition.x,
                    positionY: panoramaClickPosition.y,
                    positionZ: panoramaClickPosition.z
                }
            })
            setTimeout(() => {
                infoModal.show()
            }, 200);
        }
    }

    const onEditInfoSpot = (info) => () => {
        const { infoSpotID, name, icon, html, scale, position: { x, y, z }, delta } = info
        if (infoModal) {
            setInfoForm({
                infoSpotID, name, icon: icon && icon.fileUrl ? [icon] : [], scale, html, positionX: x, positionY: y, positionZ: z, delta
            })
            setTimeout(() => {
                infoModal.show()
            }, 200)

        }
    }

    const onEditLinkSpot = (link) => () => {

        const { linkSpotID, name, position: { x, y, z }, panoramaID } = link

        if (infoModal) {
            setLinkForm({
                linkSpotID: linkSpotID, panoramaLinkID: panoramaID, name, positionX: x, positionY: y, positionZ: z
            })
            api.getPanoramaForLink({ imagePanoramaID, exhibitorID }).then(res => {
                setPanoramaLinkOptions(res.data.result)
                setTimeout(() => {
                    linkModal.show()
                }, 100)
            })
        }
    }

    const onSubmitInfoSpot = (values) => {
        if (!values.infoSpotID) {
            api.saveInfoSpot({
                ...values,
                imagePanoramaID,
                html: values.html === "<p></p>" ? '' : values.html,
                icon: values.icon.length > 0 ? values.icon[0] : { fileName: "", filePath: "", fileUrl: "" },
            }).then(() => {
                loadPanoramas().then(() => {
                    infoModal.close()
                    dialog.showDialogSuccess({ showConfirmButton: false, message: 'Info Spot successfully created.' })
                })
            })
        } else {
            dialog.showDialogConfirm({
                message: 'Are you sure you want to update the info spot?',
                onConfirm: () => api.saveInfoSpot({
                    ...values,
                    imagePanoramaID,
                    html: values.html === "<p></p>" ? '' : values.html,
                    icon: values.icon.length > 0 ? values.icon[0] : { fileName: "", filePath: "", fileUrl: "" },
                }).then(() => {
                    loadPanoramas().then(() => {
                        infoModal.close()
                        dialog.showDialogSuccess({ showConfirmButton: false, message: 'Info spot successfully updated.' })
                    })
                })
            })
        }
    }

    const onSubmitLinkSpot = (values) => {

        if (!values.linkSpotID) {
            api.saveLinkSpot({
                ...values,
                imagePanoramaID
            }).then(() => {
                loadPanoramas().then(() => {
                    linkModal.close()
                    dialog.showDialogSuccess({ showConfirmButton: false, message: 'Link spot successfully created.' })
                })
            })
        } else {
            dialog.showDialogConfirm({
                message: 'Are you sure you want to update the link spot?',
                onConfirm: () => api.saveLinkSpot({
                    ...values,
                    imagePanoramaID
                }).then(() => {
                    loadPanoramas().then(() => {
                        linkModal.close()
                        dialog.showDialogSuccess({ showConfirmButton: false, message: 'Link spot successfully updated.' })
                    })
                })
            })
        }
    }

    const addNewStartSpot = () => {
        setShowRightMenu(false)
        const params = {
            imagePanoramaID,
            startSpotX: panoramaClickPosition.x,
            startSpotY: panoramaClickPosition.y,
            startSpotZ: panoramaClickPosition.z
        }
        if (startSpots && startSpots.x) {
            dialog.showDialogConfirm({
                message: 'Are you sure you want to update the starting point?',
                onConfirm: () => api.saveStartSpot(params).then(() => {
                    loadPanoramas().then(() => {
                        dialog.showDialogSuccess({
                            showConfirmButton: false,
                            message: 'Starting point successfully updated.'
                        })
                    })
                })
            })
        } else {
            api.saveStartSpot(params).then(() => {
                loadPanoramas().then(() => {
                    dialog.showSuccessToast("Saved")
                })
            })
        }
    }

    const onDeleteInfoSpot = (info) => () => {
        dialog.showDialogConfirm({
            message: 'Are you sure you want to delete the info spot?',
            onConfirm: () => api.deleteInfoSpot({
                infoSpotID: info.infoSpotID,
                imagePanoramaID
            }).then(() => {
                loadPanoramas().then(() => {
                    dialog.showDialogSuccess({
                        showConfirmButton: false,
                        message: 'Info spot successfully deleted.'
                    })
                })
            })
        })
    }

    const onDeleteLinkSpot = (link) => () => {
        dialog.showDialogConfirm({
            message: 'Are you sure you want to delete the link spot?',
            onConfirm: () => api.deleteLinkSpot({
                imagePanoramaID,
                linkSpotID: link.linkSpotID
            }).then(() => {
                loadPanoramas().then(() => {
                    dialog.showDialogSuccess({
                        showConfirmButton: false,
                        message: 'Link spot successfully deleted.'
                    })
                })
            })
        })
    }

    const onEditInfoPosition = (info) => () => {
        const { infoSpotID, name, icon, html, scale, position: { x, y, z }, delta } = info
        setInfoForm({
            infoSpotID, name, icon: icon && icon.fileUrl ? [icon] : [], scale, html, positionX: x, positionY: y, positionZ: z, delta
        })
        setIsPointing(true)
        dialog.showDialogInfo({
            message: '"Right Click" on the image and select "Change Info Spot Position" to change this info spot position.'
        })
    }


    const onSelectInfoPosition = () => {
        const params = {
            ...infoForm,
            imagePanoramaID,
            icon: infoForm.icon.length > 0 ? infoForm.icon[0] : { fileName: "", filePath: "", fileUrl: "" },
            positionX: panoramaClickPosition.x,
            positionY: panoramaClickPosition.y,
            positionZ: panoramaClickPosition.z
        }
        setIsPointing(false)
        setShowRightMenu(false)
        dialog.showDialogConfirm({
            message: 'Are you sure you want to update the info spot?',
            onConfirm: () => api.saveInfoSpot(params).then(() => {
                loadPanoramas().then(() => {
                    infoModal.close()
                    dialog.showDialogSuccess({ showConfirmButton: false, message: 'Info spot successfully updated.' })
                })
            })
        })
    }

    const onCancelContextMenu = () => {
        setShowRightMenu(false)
        setIsPointing(false)
    }

    const onContextMenu = (position, x, y) => {
        setPanoramaClickPosition(position)
        setShowRightMenu(true)
        setPositionMenu({ x: x, y: y })
    }

    const onInfoListItemClick = (info) => () => {
        if (tempViewer) {
            tempViewer.tweenControlCenter(new THREE.Vector3(info.position.x, info.position.y, info.position.z), 500)
        }
    }

    const onStartListItemClick = (start) => () => {
        if (tempViewer) {
            tempViewer.tweenControlCenter(new THREE.Vector3(start.x, start.y, start.z), 500)
        }
    }

    const onLinkListItemClick = (link) => () => {
        if (tempViewer) {
            tempViewer.tweenControlCenter(new THREE.Vector3(link.position.x, link.position.y, link.position.z), 500)
        }
    }

    const handelChangeFile = (fieldName) => (files) => {
        if (files.length > 0) {
            dialog.showLoading()
            api.uploadImage(files[0].imageFile).then(res => {
                infoSpotFormik.setFieldValue(fieldName, res.data.result)
                dialog.showSuccessToast("Successfully uploaded")
            })
        }
    }

    const onImageDelete = (removedFile) => {
        api.deleteFile(removedFile[0]).then(() => {
            dialog.showSuccessToast("Successfully deleted")
        })
    }

    const onFroalaImageDelete = (fileMeta) => {
        // api.deleteFile(fileMeta)
    }

    useEffect(() => {

        const PANOLENS = require('../../../static/js/panolens/panolens')
        var viewer, container, containerPanorama;

        container = document.getElementById(containerId)
        containerPanorama = document.getElementById(`${containerId}-container`)

        container.innerHTML = ""

        viewer = new PANOLENS.Viewer({ output: 'console', cameraFov: 100, container: container, autoRotate: false, autoRotateSpeed: 1, autoHideInfospot: false, });
        tempViewer = viewer

        var panoramaBooth = {}

        panoramaList.forEach(element => {

            const panorama = new PANOLENS.ImagePanorama(element.fileUrl + `?rand=${makeid(10)}`)
            panorama.addEventListener('enter-fade-start', function () {
                if (element.startSpots.x && element.startSpots.y && element.startSpots.z) {
                    viewer.tweenControlCenter(new THREE.Vector3(element.startSpots.x, element.startSpots.y, element.startSpots.z), 0);
                }
                if (element.imagePanoramaID != currentParanoramaID) {
                    setSelectedPanoramaID(element.imagePanoramaID)
                    setIsPointing(false)
                }
            })

            //add info spot
            element.infoSpots.forEach(info => {
                const icon = info.icon && info.icon.fileUrl ? info.icon.fileUrl : PANOLENS.DataImage.Info
                const spot = new PANOLENS.Infospot(info.scale, icon)
                spot.position.set(info.position.x, info.position.y, info.position.z)
                spot.addHoverElement(document.getElementById(info.infoSpotID), info.delta)
                panorama.add(spot)
            })

            panoramaBooth = Object.assign(panoramaBooth, { [element.imagePanoramaID]: panorama })

        })

        // add selected panorama to first
        Object.keys(panoramaBooth).forEach(element => {
            if (element === imagePanoramaID) {
                viewer.add(panoramaBooth[element])
            }
        })

        // add other panorama
        Object.keys(panoramaBooth).forEach(element => {
            if (element != imagePanoramaID) {
                viewer.add(panoramaBooth[element])
            }
        })

        // add link panorama
        panoramaList.forEach(element => {

            element.linkSpots.forEach(link => {
                panoramaBooth[element.imagePanoramaID].link(panoramaBooth[link.panoramaID], new THREE.Vector3(link.position.x, link.position.y, link.position.z));
            })
        })

        container.addEventListener('click', e => {
            setShowRightMenu(false)
        })


        containerPanorama.addEventListener("contextmenu", e => {
            e.preventDefault()
            const position = viewer.getPosition()
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;
            onContextMenu(position, x, y)
        })


    }, [data])

    return (
        <div className="row">
            <div className={`col-lg-9 px-0 rounded`} style={{ height: 600, backgroundColor: 'red', position: 'relative', zIndex: 100 }} id={`${containerId}-container`}>
                <div id={containerId} className={className} style={{ ...style, width: '100%', height: 600 }}>
                </div>
                <div className="menu" style={{ display: showRightMenu ? 'inline-block' : 'none', position: 'absolute', top: positionMenu.y, left: positionMenu.x }}>
                    <ul className="list-group menu-options" style={{ width: '250px' }}>
                        {!isPointing ? (
                            <>
                                <li onClick={onCreateInfoSpot} className="list-group-item menu-option list-group-item-action" style={{ cursor: 'pointer' }} ><i className="fas fa-info-circle mr-2"></i>Add Info Spot</li>
                                <li onClick={onCreateLinkSpot} className="list-group-item menu-option list-group-item-action" style={{ cursor: 'pointer' }} ><i className="fas fa-arrow-circle-up mr-2"></i>Add Link Spot</li>
                                <li onClick={addNewStartSpot} className="list-group-item menu-option list-group-item-action" style={{ cursor: 'pointer' }} ><i className="fas fa-eye mr-2"></i>Add Start Spot</li>
                            </>
                        ) : ''}
                        {isPointing ? <li onClick={onSelectInfoPosition} className="list-group-item menu-option list-group-item-action" style={{ cursor: 'pointer' }} ><i className="fas fa-map-pin mr-2"></i>Change Info Spot Position</li> : ''}
                        <li onClick={onCancelContextMenu} className="list-group-item menu-option list-group-item-action" style={{ cursor: 'pointer' }} ><i className="fas fa-ban mr-2"></i>Cancel</li>
                    </ul>
                </div>
                {isPointing ? (
                    <div style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', textAlign: 'center' }}>"Right Click" on the image and select "Change Info Spot Position" to change this info spot position.</div>
                ) : ''}
            </div>


            <div className="col-lg-3">
                <div className="card w-100 mb-2 border rounded" style={{ height: 600 }}>
                    <div className="card-header bg-white pb-0 no-bottom-card-header">
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Info</a>
                            <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Link</a>
                            <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Start</a>
                        </div>
                    </div>
                    <div className="card-body" style={{ overflowY: 'scroll' }} id="style-4">
                        <ul className="list-group list-group-flush">


                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                                    {infoSpots.map(info => {
                                        return <li key={info.infoSpotID} onClick={onInfoListItemClick(info)} className={`list-group-item spot-item d-flex justify-content-between align-items-center flex-nowrap ${isPointing && info.infoSpotID === infoForm.infoSpotID ? 'bg-danger text-white' : ''}`}>
                                            <div className="d-flex flex-nowrap align-items-center ellipsis">
                                                <i className="fas fa-info-circle mr-2"></i>
                                                <span className="mr-1 text-nowrap ellipsis">{info.name}</span>
                                            </div>
                                            <div style={{ minWidth: '62px' }}>
                                                <i onClick={onEditInfoPosition(info)} className="fas fa-map-marker-alt mr-2 btn-icon-virtual-booth"></i>
                                                <i onClick={onEditInfoSpot(info)} className="fas fa-edit mr-1 btn-icon-virtual-booth"></i>
                                                <i onClick={onDeleteInfoSpot(info)} className="fas fa-trash-alt btn-icon-virtual-booth"></i>
                                            </div>

                                        </li>
                                    })}
                                </div>
                                <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                                    {linkSpots.length > 0 ? (
                                        linkSpots.map(link => {

                                            return <li key={link.linkSpotID} onClick={onLinkListItemClick(link)} className="list-group-item spot-item d-flex justify-content-between align-items-center flex-nowrap">
                                                <div className="d-flex flex-nowrap align-items-center ellipsis">
                                                    <i className="fas fa-arrow-circle-up mr-2"></i>
                                                    <span className="mr-1 text-nowrap ellipsis">{link.name}</span>
                                                </div>
                                                <div style={{ minWidth: '42px' }}>
                                                    <i onClick={onEditLinkSpot(link)} className="fas fa-edit mr-1 btn-icon-virtual-booth"></i>
                                                    <i onClick={onDeleteLinkSpot(link)} className="fas fa-trash-alt btn-icon-virtual-booth"></i>
                                                </div>
                                            </li>
                                        })
                                    ) : null}
                                </div>
                                <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                                    {startSpots && startSpots.x ? <li onClick={onStartListItemClick(startSpots)} className="list-group-item spot-item"><i className="fas fa-eye mr-2 "></i>Start Spot</li> : null}

                                </div>
                            </div>


                        </ul>
                    </div>
                </div>

            </div>

            <div style={hideContainer} id={hideContainerId}>
                {infoSpotList.map(info => (<FroalaView key={info.infoSpotID} spotId={info.infoSpotID} html={info.html} />))}
            </div>


            {/* MODAL */}

            <JqModal ref={ref => infoModal = ref} title="Info Spot" modalId="info-modal" isLarge>
                <Formik
                    enableReinitialize
                    initialValues={infoForm}
                    validateOnBlur={true}
                    validate={(values) => {
                        const errors = {}
                        const required = ['name', 'scale']

                        required.forEach(field => {
                            if (!values[field]) {
                                errors[field] = "Required"
                            }
                        })

                        return errors
                    }}

                    onSubmit={(values, actions) => {
                        onSubmitInfoSpot(values)
                    }}
                >

                    {(formik) => {
                        infoSpotFormik = formik
                        return (
                            <Form className="p-3 mb-3 row">
                                <div className="col-lg-12 mb-2">
                                    <Field label="Info Spot Name" name="name" component={TextField} required />
                                </div>
                                <div className="col-lg-4 mb-2">
                                    <Field label="Spot Icon" name="icon" component={ChooseFile} onChange={handelChangeFile('icon')} onRemove={onImageDelete} className="input-group w-100" />
                                </div>
                                <div className="col-lg-4 mb-2">
                                    <Field label="Icon Scale" name="scale" component={TextField} type="number" required />
                                </div>
                                <div className="col-lg-4 mb-2">
                                    <Field label="Bottom Space" name="delta" component={TextField} type="number" required />
                                </div>
                                <div className="col-lg-12 mb-4">
                                    <Field name="html" label="Content" component={FroalaEditor} onDeleteImage={onFroalaImageDelete} zIndex={999999}/>
                                </div>

                                <div className="col-lg-12 text-center">
                                    <button type="button" onClick={formik.handleSubmit} className="btn btn-danger px-3 mr-2" >{infoForm.infoSpotID ? "Save" : 'Create'}</button>
                                    <button type="button" onClick={() => infoModal.close()} className="btn btn-secondary px-3" >Cancel</button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </JqModal>

            <JqModal ref={ref => linkModal = ref} title="Link Spot" modalId="link-modal">
                <Formik
                    enableReinitialize
                    initialValues={linkForm}
                    validateOnBlur={false}
                    validate={(values) => {
                        const errors = {}
                        const required = ['name', 'panoramaLinkID']

                        required.forEach(field => {
                            if (!values[field]) {
                                errors[field] = "Required"
                            }
                        })

                        return errors
                    }}

                    onSubmit={(values, actions) => {
                        onSubmitLinkSpot(values)
                    }}

                >

                    {(formik) => {
                        return (
                            <Form className="p-3 mb-3">
                                <div className="col-lg-12 mb-2">
                                    <Field label="Link Spot Name" name="name" component={TextField} required />
                                </div>
                                <div className="col-lg-12 mb-4">
                                    <Field label="Panorama" name="panoramaLinkID" component={Select} required options={panoramaLinkOptions} idFieldName="imagePanoramaID" labelFieldName="name" isMultiLang={false} />
                                </div>

                                <div className="col-lg-12 text-center">
                                    <button type="button" onClick={formik.handleSubmit} className="btn btn-danger px-3 mr-2" >{linkForm.linkSpotID ? 'Save' : 'Create'}</button>
                                    <button type="button" onClick={() => linkModal.close()} className="btn btn-secondary px-3" >Cancel</button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </JqModal>

        </div>
    )
}








// PAGE VIRTUAL BOOTH
export class VirtualBooth extends Component {

    static async getInitialProps(ctx) {

        const exhibitorID = getExhibitorID(ctx)

        try {
            const res = await api.getPanorama({ exhibitorID }, ctx)
            return {
                exhibitorID,
                panoramaList: res.data.result
            }
        } catch (error) {
            return {
                exhibitorID,
                panoramaList: [],
            }
        }

    }

    constructor(props) {
        super(props)
        this.state = {
            panoramaList: props.panoramaList,
            exhibitorID: props.exhibitorID,
            selectedPanoramaID: ''
        }
    }

    loadPanoramas = () => {
        const { exhibitorID } = this.state
        return api.getPanorama({ exhibitorID }).then(res => {
            this.setState({
                panoramaList: res.data.result,
            })
        })
    }

    setSelectedPanoramaID = (id) => {
        this.setState({ selectedPanoramaID: id })
    }

    render() {

        const { exhibitorID, panoramaList, selectedPanoramaID } = this.state
        const { account } = this.props
        const selectedPanorama = panoramaList.find(pano => pano.imagePanoramaID === selectedPanoramaID)
        const links = [
            {
                href: '/exhibitor',
                label: 'Exhibitors',
                active: false
            }, {
                href: '/',
                label: 'Detail',
                active: true
            }
        ]

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Exhibitor Detail</h1>
                </div>

                {account.roleName !== ROLES.EXHIBITOR ? (
                    <Breadcrumb links={links} />
                ) : <div className="mb-4" />}

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            
                            {account.roleName !== ROLES.EXHIBITOR ? (
                                <ExhibitorNav currentTab="virtual-booth" exhibitorId={exhibitorID} />
                            ) : ''}
                            
                            <div className="col-md-12 p-3">

                                <ImageDrop
                                    oldFiles={panoramaList}
                                    onDelete={({ fileToDelete }) => {
                                        const { imagePanoramaID, fileName, filePath, fileUrl } = fileToDelete
                                        dialog.showDialogConfirm({
                                            message: 'Are you sure you want to delete this booth?',
                                            onConfirm: () => {
                                                return api.deletePanorama({ imagePanoramaID, exhibitorID }).then(() => {
                                                    api.deleteFile({ fileName, filePath, fileUrl }).then(() => {
                                                        this.loadPanoramas().then(() => {
                                                            dialog.showSuccessToast("Booth successfully deleted.")
                                                        })
                                                    })
                                                })
                                            }
                                        })
                                    }}
                                    onSorted={sortedImgs => {
                                        api.savePanoramaOrder(sortedImgs.map((img, index) => ({
                                            imagePanoramaID: img.imagePanoramaID,
                                            sequence: index
                                        }))).then(() => {
                                            this.loadPanoramas().then(() => {
                                                dialog.showSuccessToast("Saved")
                                            })
                                        })
                                    }}
                                    onAddFile={({ acceptedFiles }) => {
                                        const file = acceptedFiles.splice(0)

                                        dialog.textInput({
                                            title: "Please provide a Panorama Name.",
                                            onConfirm: (name) => {
                                                dialog.showLoading()
                                                api.uploadPanoramaImage(file[0], exhibitorID).then(res => {

                                                    const fileMeta = res.data.result[0]
                                                    fileMeta.name = name
                                                    api.savePanorama({ ...fileMeta, exhibitorID }).then(() => {
                                                        this.loadPanoramas().then(() => {
                                                            dialog.showSuccessToast("Successfully uploaded")
                                                        })
                                                    })
                                                })
                                            }
                                        })
                                    }}
                                    onEdit={(fileToEdit) => {
                                        this.setState({ selectedPanoramaID: fileToEdit.imagePanoramaID })
                                    }}
                                />

                                {selectedPanoramaID && selectedPanorama ? (
                                    <PanoramaEditorView
                                        id="panorama-editor-view"
                                        style={{ width: '100%', height: '400px', borderRadius: '5px', overflow: 'hidden' }}
                                        selectedPanoramaID={selectedPanoramaID}
                                        data={selectedPanorama}
                                        panoramaList={panoramaList}
                                        setSelectedPanoramaID={this.setSelectedPanoramaID}
                                        loadPanoramas={this.loadPanoramas}
                                    />
                                ) : ''}


                            </div>
                        </Box>
                    </div>

                </div>

            </MainLayout>
        )
    }
}

var thumb = {
    display: 'inline-flex',
    position: 'relative',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 150,
    height: 150,
    boxSizing: 'border-box',
    cursor: 'grab'
};

var thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
};

var img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

var deletes = {
    height: '30px',
    padding: '8px',
    width: '30px',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '15px',
    alignItems: 'center',
    cursor: 'pointer',
    top: '6px',
    right: '6px'
}

var view = {
    height: '30px',
    width: '30px',
    padding: '8px',
    borderRadius: '15px',
    position: 'absolute',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    bottom: '6px',
    right: '6px'
}

var hideContainer = {
    display: 'none'
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export default withAuth(VirtualBooth, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.EXHIBITOR])
