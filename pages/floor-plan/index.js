import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, Pagination, JqModal, dialog } from '../../components'
import Link from 'next/link'
import { withAuth } from '../../services/auth'
import { Form, Field, Formik } from 'formik'
import { TextField, MapChooser } from '../../components/formik'
import api from '../../services/webservice'
import { capitalize } from '../../util/utilities'
import { ROLES } from '../../util/constants'

const count = 5

export class FloorPlans extends Component {

    static async getInitialProps(ctx) {

        try {
            const res = await Promise.all([
                api.getFloorPlans({ keyword: '', page: 1, count }, ctx)
            ])

            const total = res[0].data.result.total
            const floorPlanList = res[0].data.result.floorPlanList

            return {
                total,
                floorPlanList,
                categories: []
            }

        } catch (error) {
            return {
                error,
                total: 0,
                floorPlanList: [],
                categories: []
            }
        }
    }

    constructor(props) {
        super(props)
        this.modal
        this.delay
        this.state = {
            floorPlanList: props.floorPlanList,
            keyword: "",
            page: 1,
            total: props.total,
            categories: props.categories
        }
    }

    onRemoveFloorPlan = (floorPlan) => () => {
        dialog.showDialogConfirm({
            onConfirm: () => {
                return api.deleteFloorPlan({ floorPlanID: floorPlan.id }).then(() => {
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            showConfirmButton: false,
                            onClose: () => this.loadFloorPlans()
                        })
                    }, 250)
                })
            }
        })
    }

    onSubmitNewFloorPlan = (values, actions) => {
        dialog.showDialogConfirm({
            message: 'Are you sure you want to create the floor plan?',
            onConfirm: () => {
                const params = {
                    name: values.name,
                    floorImage: values.floorImage.length > 0 ? values.floorImage[0] : { fileName: "", filePath: "", fileUrl: "" }
                }
                return api.createFloorPlan(params).then(() => {
                    this.modal.close()
                    actions.resetForm()
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            message:'Successfully created.',
                            showConfirmButton: false,
                            onClose: () => this.loadFloorPlans()
                        })
                    }, 250)
                })
            }
        })
    }

    onCancelModal = (formik) => () => {
        formik.resetForm()
        this.modal.close()
    }

    onCreate = () => {
        this.modal.show()
    }

    onPageSelect = (selectedPage) => {
        this.setState({ page: selectedPage })
    }

    onSearch = e => {
        this.setState({ keyword: e.target.value, page: 1 })
    }

    loadFloorPlans = () => {
        const { keyword, page } = this.state
        return api.getFloorPlans({ keyword, page, count }).then(res => {
            const { floorPlanList, total } = res.data.result
            this.setState({ floorPlanList, total })
        })
    }

    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.keyword !== this.state.keyword) {
            if (this.delay) {
                clearTimeout(this.delay)
                this.delay = null
            }
            this.delay = setTimeout(() => {
                this.loadFloorPlans()
            }, 400)
        } else if (prevStates.page !== this.state.page) {
            this.loadFloorPlans()
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

    render() {

        const { keyword, page, total, floorPlanList } = this.state

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Floor Plan</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>

                            <div className="row ">
                                <div className="input-group col-md-6 my-3">
                                    <input value={keyword} onChange={this.onSearch} type="text" className="form-control bg-light border small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <button className="btn btn-danger" type="button">
                                            <i className="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-3 col-lg-4" />

                                <div className="col-md-3 col-lg-2">
                                    <button className="btn btn-block btn-danger my-3" onClick={this.onCreate}><i className="fas fa-plus mr-1" />Create</button>
                                </div>
                            </div>


                            <ul className="list-unstyled">
                                {floorPlanList.map(this.renderItemFloorplan.bind(this))}
                            </ul>

                            <div className="col-md-12 p3">
                                <Pagination pageSize={count} length={3} currentPage={page} total={total} onClick={this.onPageSelect} />
                            </div>
                        </Box>
                    </div>

                </div>


                <JqModal ref={ref => this.modal = ref} title="Create Floor Plan" isLarge>
                    <Formik

                        initialValues={{
                            name: "",
                            floorImage: []
                        }}
                        validate={(values) => {
                            console.log(values);

                            const errors = {}
                            const required = ['name']

                            required.forEach(field => {
                                if (!values[field]) {
                                    errors[field] = "Required"
                                }
                            })

                            if (values['floorImage'].length === 0) {
                                errors['floorImage'] = "Required"
                            }

                            return errors
                        }}

                        onSubmit={(values, actions) => {
                            this.onSubmitNewFloorPlan(values, actions)
                        }}
                    >

                        {(formik) => {
                            this.formikInfo = formik
                            return (
                                <Form className="p-3 mb-3">
                                    <div className="col-lg-12 mb-2">
                                        <Field label="Floor Plan Name" name="name" component={TextField} required />
                                    </div>

                                    <div className="col-lg-12 mb-2">
                                        <Field label="Floor Plan (svg)" name="floorImage" component={MapChooser} className="input-group pl-0" onChange={this.handelChangeFile('floorImage')} onRemove={this.onImageDelete} required />
                                    </div>

                                    <div className="col-lg-12 text-center">
                                        <button type="button" onClick={formik.handleSubmit} className="btn btn-danger px-3 mr-2" >Create</button>
                                        <button type="button" onClick={this.onCancelModal(formik)} className="btn btn-secondary px-3" >Cancel</button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </JqModal>


            </MainLayout>
        )
    }

    renderItemFloorplan(plan) {

        fetch(plan.floorImage + '?id=' + plan.id)
            .then(res => {
                res.text().then(d => {
                    const element = $(`#item-floorplan-${plan.id}`)
                    if (element) {
                        const svg = $(d)
                        svg.attr("width", 150)
                        svg.attr("height", 120)
                        element.html(svg)
                    }
                })
            })

        return (
            <li className="media border hover-box-shadow p-2 mb-2 d-flex align-items-center" style={{ minWidth: '500px' }} key={plan.id}>
                {/* <SvgInline url={plan.floorImage}/> */}
                {/* <img className="mr-3 border list-img" src={'../../static/img/plans.png'} alt="floor image" width={150} height={150} /> */}
                <div id={`item-floorplan-${plan.id}`} className="container-item-floorplan" >
                    <div style={{ height: 120, width: 150 }}></div>
                </div>
                <div className="media-body">
                    <h5 className="mt-0 mb-1 font-weight-bold">{plan.name}</h5>
                    <div className="row">
                        {/* <div className="col-12"><strong className="mr-1">Product owner:</strong>{item.productOwner}</div> */}
                        <div className="col-12"><strong className="mr-1">Status:</strong>
                            <span className={`${plan.status ? 'text-success' : ''}`}>{capitalize(plan.status ? 'Active' : 'Inactive')}</span>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-danger" title="Remove" onClick={this.onRemoveFloorPlan(plan)}>
                            <i className="fas fa-trash-alt"></i>
                        </button>
                        <Link href="/floor-plan/[floorPlanId]" as={`/floor-plan/${plan.id}`}>
                            <a className="btn btn-danger" title="Edit">
                                <i className="fas fa-pen"></i>
                            </a>
                        </Link>
                    </div>
                </div>
            </li>
        )

    }
}


export default withAuth(FloorPlans, [ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.SUPER_ADMIN])