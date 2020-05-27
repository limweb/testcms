import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, JqModal, dialog, Breadcrumb } from '../../components'
import { withAuth } from '../../services/auth'
import { Form, Field, Formik } from 'formik'
import { TextField, SelectSuggest, FroalaEditor } from '../../components/formik'
import api from '../../services/webservice'
import { isEmpty } from '../../util/utilities'
import { PreviewFloorPlan } from '../../components/PreviewFloorPlan'
import { resizeCallback } from '../../lib/mapplic/mapplic'
import Router from 'next/router'
import { ROLES } from '../../util/constants'

const emptyEditForm = {
    id: "",
    floorLocationID: "",
    exhibitor: null,
    exhibitorID: "",
    boothNumber: "",
    description: "",
    position: { x: undefined, y: undefined }
}

export class FloorPlan extends Component {

    static async getInitialProps(ctx) {

        try {
            const floorPlanID = ctx.query.floorPlanId
            const res = await Promise.all([
                api.getFloorPlanDetail({ floorPlanID }, ctx),
                api.getProductCategory(ctx)
            ])

            const floorDetail = res[0].data.result
            const categories = res[1].data.result.categorie.map(cat => ({ id: cat.id, title: cat.name, color: '#ee3135', show: true }))

            return {
                floorPlanID,
                floorDetail,
                categories
            }
        } catch (error) {
            return {
                error,
                floorPlanID: '',
                floorDetail: {},
                categories: []
            }
        }
    }

    constructor(props) {
        super(props)
        this.modal
        this.delay
        this.state = {
            floorPlanID: props.floorPlanID,
            floorDetail: props.floorDetail,
            defaultOptions: [],
            editForm: emptyEditForm,
            categories: props.categories,
            keyword: ""
        }
    }

    onRemoveFloorPlan = (floorPlanID) => () => {
        dialog.showDialogConfirm({
            message:'Are you sure you want to delete the floor plan?',
            onConfirm: () => {
                return api.deleteFloorPlan({ floorPlanID }).then(() => {
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            message:'Successfully deleted',
                            showConfirmButton: false,
                            onClose: () => Router.push('/floor-plan')
                        })
                    }, 250)
                })
            }
        })
    }

    onSubmitEditFloorPlan = (values) => {
        if (this.delay) {
            clearTimeout(this.delay)
            this.delay = null
        }
        this.delay = setTimeout(() => {
            const params = {
                floorPlanID: this.state.floorPlanID,
                name: values.title,
            }
            api.editFloorPlan(params).then(() => {
                setTimeout(() => {
                    dialog.showSuccessToast("Saved")
                }, 250)
            })
        }, 750)
    }

    onCancelModal = (formik) => () => {
        formik.resetForm()
        this.modal.close()
    }

    onShowModal = () => {
        this.modal.show()
        api.getRestExhibitors().then(res => {
            this.setState({ defaultOptions: res.data.result.map(ex => ({ value: ex.exhibitorID, label: ex.name, boothNumber: ex.boothNumber, image: ex.imgageLogo })) })
        })
        setTimeout(() => {
            resizeCallback('add-location')
        }, 500);
    }

    onAddNewExhibitor = (values, actions) => {
        const { floorPlanID: floorID } = this.state
        api.addExhibitorToFloor({
            floorID,
            ...values,
            x: values.position.x,
            y: values.position.y
        }).then(() => {
            actions.resetForm()
            this.modal.close()
            dialog.showSuccessToast("Saved", 700, () => Router.reload())
        }).catch(() => {
            actions.resetForm()
        })
    }

    onRemoveExhibitor = (exhibitor) => () => {
        dialog.showDialogConfirm({
            message: 'Are you sure you want to delete the exhibition?',
            onConfirm: () => api.removeExhibitorFromFloor({
                floorLocationID: exhibitor.locationID
            }).then(() => {
                dialog.showSuccessToast("Successfully deleted", 700, () => Router.reload())
            })
        })
    }

    onEditExhibitor = (exhibitor) => () => {
        const { id, boothNumber, locationID, exhibitorID, description, x, y, title } = exhibitor
        this.setState({
            editForm: {
                id,
                floorLocationID: locationID,
                exhibitor: {
                    value: exhibitorID,
                    label: title,
                    boothNumber
                },
                exhibitorID,
                boothNumber,
                description,
                position: { x, y }
            }
        }, () => {
            this.editModal.show()
            setTimeout(() => {
                resizeCallback('edit-location')
            }, 500)
        })
    }

    onCancelEditModal = () => () => {
        this.setState({ editForm: emptyEditForm })
        this.editModal.close()
    }

    submitEditExhibitor = (values) => {
        const { floorPlanID: floorID } = this.state
        dialog.showDialogConfirm({
            message: 'Are you sure you want to update the exhibition?',
            onConfirm: () => api.editExhibitorOfFloor({
                floorID,
                ...values,
                x: values.position.x,
                y: values.position.y
            }).then(() => {
                this.modal.close()
                dialog.showDialogSuccess({
                    message: 'Successfully updated',
                    showConfirmButton: false,
                    onClose: () => Router.reload()
                })
            }).catch(() => {
                this.setState({ editForm: emptyEditForm })
            })
        })
    }

    loadFloorPlan = () => {
        const { floorPlanID } = this.state
        return api.getFloorPlanDetail({ floorPlanID }).then(res => {
            const floorDetail = res.data.result
            this.setState({ floorDetail })
        })
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
        if (false) {
            api.deleteFile(fileMeta)
        }
    }

    onSearch = e => {
        this.setState({ keyword: e.target.value })
    }

    render() {

        const { floorDetail, floorPlanID, defaultOptions, editForm, categories, keyword } = this.state
        const { title, floorImage, locations } = floorDetail

        const loc = locations.map(ex => {
            return {
                ...ex,
                zoom: 3
            }
        })

        const exhibitors = locations.filter(ex => {
            return ex.title.toLowerCase().includes(keyword.toLowerCase())
        })

        const locJson = JSON.stringify(loc)

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Manage Floor Plan</h1>
                </div>
                <Breadcrumb
                    links={[
                        {
                            href: '/floor-plan',
                            label: 'Floor plan',
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

                            <button className="btn btn-block btn-danger col-md-2 col-sm-3 col-4" style={{ position: 'absolute', right: '34px' }} onClick={this.onRemoveFloorPlan(floorPlanID)}>Delete</button>

                            <Formik

                                initialValues={{
                                    floorPlanID,
                                    title,
                                    floorImage: floorImage && floorImage.fileUrl ? [floorImage] : []
                                }}
                                validateOnBlur={false}
                                validate={(values) => {
                                    const errors = {}
                                    const required = ['title']

                                    required.forEach(field => {
                                        if (!values[field]) {
                                            errors[field] = "Required"
                                        }
                                    })

                                    if (values['floorImage'].length <= 0) {
                                        errors['floorImage'] = "Required"
                                    }

                                    if (isEmpty(errors)) {
                                        this.onSubmitEditFloorPlan(values)
                                    }

                                    return errors
                                }}
                            >

                                {(formik) => {
                                    this.formikInfo = formik
                                    return (
                                        <Form className="row p-3 mb-3">
                                            <div className="col-lg-12 mb-3">
                                                <Field label="Floor Plan Name" name="title" component={TextField} required />
                                            </div>

                                            <div className="col-lg-12 mb-3">
                                                <PreviewFloorPlan src={floorImage.fileUrl} mapName="exhibitors" hovertip mapId={floorPlanID} previewId="show-preview" locations={JSON.parse(locJson)} isEditing={false} sidebar={true} categories={categories} defaultSidebarLogo="../../static/img/thaifex.png" />
                                            </div>

                                            <div className="col-lg-12 mb-3">
                                                <button type="button" onClick={this.onShowModal} className="btn btn-danger px-3 mb-2" ><i className="fas fa-plus mr-1" />Add Exhibitor To Floor Plan</button>

                                                <div className="input-group col-lg-4 float-right mb-3 p-0">
                                                    <input value={keyword} onChange={this.onSearch} type="text" className="form-control bg-light border small" placeholder="Search for exhibitors" aria-label="Search" aria-describedby="basic-addon2" />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-danger" type="button">
                                                            <i className="fas fa-search fa-sm"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="table-responsive" style={{ maxHeight: '300px' }}>
                                                    <table className="table table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" className="text-center">Logo</th>
                                                                <th scope="col" className="align-middle">Exhibitor</th>
                                                                <th scope="col" className="align-middle text-center">Booth no.</th>
                                                                <th scope="col" className="align-middle text-center">Country</th>
                                                                <th scope="col" className="align-middle text-center">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {exhibitors.map((ex) => {
                                                                return (
                                                                    <tr key={ex.id}>
                                                                        <td className="text-center align-middle"><img className="mr-2 border list-logo " src={ex.thumbnail || '../../static/img/thaifex.png'} alt="exhibitor image" /></td>
                                                                        <td className="align-middle">{ex.title}</td>
                                                                        <td className="align-middle text-center">{ex.boothNumber}</td>
                                                                        <td className="align-middle text-center">{ex.country}</td>
                                                                        <td className="align-middle text-center">
                                                                            <span className="btn-icon-virtual-booth mr-2" onClick={this.onRemoveExhibitor(ex)} style={{ cursor: 'pointer', fontSize: 18 }}>
                                                                                <i className="fas fa-trash"></i>
                                                                            </span>
                                                                            <span className="btn-icon-virtual-booth" onClick={this.onEditExhibitor(ex)} style={{ cursor: 'pointer', fontSize: 18 }}>
                                                                                <i className="fas fa-pen"></i>
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Form>
                                    )
                                }}
                            </Formik>


                        </Box>
                    </div>

                </div>


                <JqModal ref={ref => this.modal = ref} title="Add New Exhibitor" isLarge>
                    <Formik

                        initialValues={{
                            id: "",
                            exhibitor: null,
                            exhibitorID: "",
                            boothNumber: "",
                            description: "",
                            position: { x: undefined, y: undefined }
                        }}
                        validate={(values) => {

                            const errors = {}
                            const required = ['exhibitorID', 'boothNumber']

                            required.forEach(field => {
                                if (!values[field]) {
                                    errors[field] = "Required"
                                }
                            })

                            if (!values['id']) {
                                errors['id'] = 'Please enter the location.'
                            }

                            if (!values['position'].x || !values['position'].y) {
                                errors['position'] = "Please enter the position."
                            }

                            if (!(values['exhibitor'] && values['exhibitor'].value)) {
                                errors['exhibitor'] = "Required"
                            }

                            return errors
                        }}

                        onSubmit={(values, actions) => {
                            this.onAddNewExhibitor(values, actions)
                        }}
                    >

                        {(formik) => {
                            const isError = Boolean((formik.errors['position'] && formik.touched['position']))
                            return (
                                <Form className="p-3 mb-3 row">
                                    <div className="col-lg-6 mb-2">
                                        <Field onChange={selected => {
                                            if (selected) {
                                                formik.setFieldValue('boothNumber', selected.boothNumber)
                                                formik.setFieldValue('exhibitorID', selected.value)
                                            } else {
                                                formik.setFieldValue('boothNumber', '')
                                                formik.setFieldValue('exhibitorID', '')
                                            }
                                        }} label="Exhibitor" name="exhibitor" component={SelectSuggest} required placeholder="Search" fetchCallback={api.getRestExhibitors} defaultOptions={defaultOptions} />
                                    </div>

                                    <div className="col-lg-6 mb-2">
                                        <Field label="Booth Number" name="boothNumber" component={TextField} required disabled={true} />
                                    </div>

                                    <div className="col-lg-12 mb-4">
                                        <Field name="description" label="Description" component={FroalaEditor} media={false} onDeleteImage={this.onFroalaImageDelete} zIndex={999999}/>
                                    </div>

                                    <div className="col-lg-12 mb-3 mt-3">
                                        <PreviewFloorPlan
                                            onClickMap={(e, pos) => {
                                                formik.setFieldValue('position', pos)
                                            }}
                                            onClickLocation={(id) => {
                                                if (id) {
                                                    formik.setFieldValue('id', id)
                                                } else {
                                                    dialog.showDialogWarning({
                                                        message: "Please select free space.",
                                                        onClose: () => {
                                                            formik.setFieldValue('id', '')
                                                            formik.setFieldValue('position', { x: undefined, y: undefined })
                                                        }
                                                    })
                                                }
                                            }}
                                            src={floorImage.fileUrl} mapName="add-location" sidebar={false} hovertip={true} mapId={floorPlanID} previewId="preview-add-location" locations={JSON.parse(locJson)} isEditing={true} />
                                    </div>

                                    <div className="col-lg-1" />
                                    <div className="col-lg-5 mb-2">
                                        <div>Position (Select on map) <span className="text-danger">*</span></div>
                                        <div className="pl-2">X: {formik.values.position.x}</div>
                                        <div className="pl-2">Y: {formik.values.position.y}</div>
                                        {isError && <div className="text-danger">{formik.errors['position']}</div>}
                                    </div>

                                    <div className="col-lg-5 mb-2">
                                        <div>Location ID (Select on map) <span className="text-danger">*</span></div>
                                        <div className="pl-2">ID: {formik.values.id}</div>
                                        {isError && <div className="text-danger">{formik.errors['id']}</div>}
                                    </div>
                                    <div className="col-lg-1" />

                                    <div className="col-lg-12 text-center">
                                        <button type="submit" onClick={formik.handleSubmit} className="btn btn-danger px-3 mr-2" >Add</button>
                                        <button type="button" onClick={this.onCancelModal(formik)} className="btn btn-secondary px-3" >Cancel</button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </JqModal>



                <JqModal ref={ref => this.editModal = ref} title="Edit Exhibitor" isLarge modalId="edit-modal">
                    <Formik
                        enableReinitialize
                        initialValues={editForm}
                        validate={(values) => {

                            const errors = {}
                            const required = ['exhibitorID', 'boothNumber', 'id']

                            console.log(values);


                            required.forEach(field => {
                                if (!values[field]) {
                                    errors[field] = "Required"
                                }
                            })

                            if (!values['position'].x || !values['position'].y) {
                                errors['position'] = "Please enter the position."
                            }

                            if (!(values['exhibitor'] && values['exhibitor'].value)) {
                                errors['exhibitor'] = "Please enter the location."
                            }

                            return errors
                        }}

                        onSubmit={(values, actions) => {
                            this.submitEditExhibitor(values, actions)
                        }}
                    >

                        {(formik) => {
                            this.editFormik = formik
                            const isError = Boolean((formik.errors['position'] && formik.touched['position']))
                            return (
                                <Form className="p-3 mb-3 row">
                                    <div className="col-lg-6 mb-2">
                                        <Field onChange={selected => {
                                            if (selected) {
                                                formik.setFieldValue('boothNumber', selected.boothNumber)
                                                formik.setFieldValue('exhibitorID', selected.value)
                                            } else {
                                                formik.setFieldValue('boothNumber', '')
                                                formik.setFieldValue('exhibitorID', '')
                                            }
                                        }} label="Exhibitor" name="exhibitor" component={SelectSuggest} required placeholder="Search" fetchCallback={api.getRestExhibitors} defaultOptions={defaultOptions} disabled />
                                    </div>

                                    <div className="col-lg-6 mb-2">
                                        <Field label="Booth Number" name="boothNumber" component={TextField} required disabled={true} />
                                    </div>

                                    <div className="col-lg-12 mb-3">
                                        <Field name="description" label="Description" component={FroalaEditor} media={false} onDeleteImage={this.onFroalaImageDelete} zIndex={999999}/>
                                    </div>

                                    <div className="col-lg-12 mb-3 mt-3">
                                        <PreviewFloorPlan
                                            onClickMap={(e, pos) => {
                                                formik.setFieldValue('position', pos)
                                            }}
                                            onClickLocation={(id) => {
                                                if (id) {
                                                    formik.setFieldValue('id', id)
                                                } else {
                                                    dialog.showDialogWarning({
                                                        message: "Please select free space.",
                                                        onClose: () => {
                                                            formik.setFieldValue('id', '')
                                                            formik.setFieldValue('position', { x: undefined, y: undefined })
                                                        }
                                                    })
                                                }
                                            }}
                                            src={floorImage.fileUrl} mapName="edit-location" sidebar={false} hovertip={true} mapId={floorPlanID} previewId="preview-edit-location" locations={JSON.parse(locJson)} isEditing={true} />
                                    </div>

                                    <div className="col-lg-1" />
                                    <div className="col-lg-5 mb-2">
                                        <div>Position (Select on map) <span className="text-danger">*</span></div>
                                        <div className="pl-2">X: {formik.values.position.x}</div>
                                        <div className="pl-2">Y: {formik.values.position.y}</div>
                                        {isError && <div className="text-danger">{formik.errors['position']}</div>}
                                    </div>

                                    <div className="col-lg-5 mb-2">
                                        <div>Location ID (Select on map) <span className="text-danger">*</span></div>
                                        <div className="pl-2">ID: {formik.values.id}</div>
                                        {isError && <div className="text-danger">{formik.errors['id']}</div>}
                                    </div>
                                    <div className="col-lg-1" />

                                    <div className="col-lg-12 text-center">
                                        <button type="button" onClick={formik.handleSubmit} className="btn btn-danger px-3 mr-2" >Save</button>
                                        <button type="button" onClick={this.onCancelEditModal(formik)} className="btn btn-secondary px-3" >Cancel</button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </JqModal>


            </MainLayout>
        )
    }
}

function deepCopyArray(arr) {
    return JSON.parse(JSON.stringify(arr))
}

export default withAuth(FloorPlan, [ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.SUPER_ADMIN])