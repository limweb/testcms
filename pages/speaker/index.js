import React, { Component } from 'react'
import ExhibitorNav from '../../components/layout/exhibitor-nav'
import MainLayout from '../../components/layout/MainLayout'
import { Box, Pagination, JqModal, ButtonApp, dialog } from '../../components'
import Link from 'next/link'
import { withAuth } from '../../services/auth'
import { Form, Field, Formik } from 'formik'
import { Select, TextField } from '../../components/formik'
import api from '../../services/webservice'
import Router from 'next/router'
import { PRODUCT_STATUS, ROLES } from '../../util/constants'
import { capitalize } from '../../util/utilities'

const count = 5

export class Product extends Component {

    static async getInitialProps(ctx) {

        try {

            // const res = await api.getSpeakers({}, ctx)
            // const { total, speakerList } = res.data.result

            return {
                total : 12,
                speakerList: [
                    {
                        id:'123',
                        firstName: 'abc',
                        lastName: 'xyz',
                        title: 'Mr.',
                        company: 'eventthai',
                        position: 'speaker',
                        status: 'active'
                    }
                ],
            }
        } catch (error) {
            return {
                error,
                total: 0,
                speakerList: []
            }
        }
    }

    constructor(props) {
        super(props)
        this.modal
        this.delay
        this.state = {
            keyword: "",
            page: 1,
            total: props.total,
            speakerList: props.speakerList
        }
    }

    onRemoveSpeaker = (speaker) => () => {
        dialog.showDialogConfirm({
            onConfirm: () => {
                return api.deleteSpeaker({ speakerID: speaker.id }).then(() => {
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            showConfirmButton: false,
                            onClose: () => this.loadSpeaker()
                        })
                    }, 250);
                })
            }
        })
    }

    onSubmitNewSpeaker = (values, actions) => {
        api.createProduct({ ...values }).then(() => {
            this.modal.close()
            actions.resetForm()
            setTimeout(() => {
                dialog.showDialogSuccess({
                    showConfirmButton: false,
                    onClose: () => this.loadSpeaker()
                })
            }, 250)
        })
    }

    onCancelModal = (formik) => () => {
        formik.resetForm()
        this.modal.close()
    }

    onCreateSpeaker = () => {
        this.modal.show()
    }

    onPageSelect = (selectedPage) => {
        this.setState({ page: selectedPage })
    }

    onSearch = e => {
        this.setState({ keyword: e.target.value, page: 1 })
    }

    loadSpeaker = () => {
        const { keyword, page } = this.state
        return Promise.all([
            api.getSpeakers({ keyword, page, count })
        ]).then(res => {
            const { speakerList, total } = res[0].data.result
            this.setState({ speakerList, total })
        })
    }

    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.keyword !== this.state.keyword) {
            if (this.delay) {
                clearTimeout(this.delay)
                this.delay = null
            }
            this.delay = setTimeout(() => {
                this.loadSpeaker()
            }, 400)
        } else if (prevStates.page !== this.state.page) {
            this.loadSpeaker()
        }
    }

    render() {

        const { keyword, page, total, speakerList } = this.state

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Speaker</h1>
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
                                    <button className="btn btn-block btn-danger my-3" onClick={this.onCreateSpeaker}><i className="fas fa-plus mr-1"/>Create</button>
                                </div>
                            </div>


                            <ul className="list-unstyled">
                                {speakerList.map(item => {
                                    return (
                                        <li className="media border hover-box-shadow p-2 mb-2" style={{ minWidth: '500px' }} key={item.id}>
                                            <img className="mr-3 border list-img" src={item.imageProfile || '../../static/img/speaker.png'} alt="speaker image" />
                                            <div className="media-body">
                                                <h5 className="mt-0 mb-1 font-weight-bold">{item.title} {item.firstName} {item.lastName}</h5>
                                                <div className="row">
                                                    {/* <div className="col-12"><strong className="mr-1">Product owner:</strong>{item.productOwner}</div> */}
                                                    <div className="col-12"><strong className="mr-1">Status:</strong>
                                                        <span className={`${item.status === 'active' ? 'text-success' : ''}`}>{capitalize(item.status)}</span>
                                                    </div>
                                                    <div className="col-12">
                                                        <strong className="mr-1">Company:</strong>{item.company}
                                                    </div>
                                                    <div className="col-12">
                                                        <strong className="mr-1">Position:</strong>{item.position}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <button type="button" className="btn btn-danger" title="Remove" onClick={this.onRemoveSpeaker(item)}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                    <Link href="/speaker/[speakerId]" as={`/speaker/${item.id}`}>
                                                        <a className="btn btn-danger" title="Edit">
                                                            <i className="fas fa-pen"></i>
                                                        </a>
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>

                            <div className="col-md-12 p3">
                                <Pagination pageSize={count} length={3} currentPage={page} total={total} onClick={this.onPageSelect} />
                            </div>
                        </Box>
                    </div>

                </div>


                <JqModal ref={ref => this.modal = ref} title="Create Speaker">
                    <Formik

                        initialValues={{
                            firstName: "",
                            lastName:"",
                            title: "",

                        }}
                        validateOnBlur={false}
                        validate={(values) => {
                            const errors = {}
                            const required = ['firstName', 'lastName', 'title']

                            required.forEach(field => {
                                if (!values[field]) {
                                    errors[field] = "Required"
                                }
                            })

                            return errors
                        }}

                        onSubmit={(values, actions) => {
                            this.onSubmitNewSpeaker(values, actions)
                        }}
                    >

                        {(formik) => {
                            return (
                                <Form className="p-3 mb-3">
                                    <div className="col-lg-12 mb-2">
                                        <Field label="Title" name="title" component={Select} required options={[{value:'Ms.'},{value:'Mrs.'}, {value:'Mr.'}]} idFieldName="value" labelFieldName="value" isMultiLang={false} />
                                    </div>

                                    <div className="col-lg-12 mb-2">
                                        <Field label="First Name" name="firstName" component={TextField} required />
                                    </div>

                                    <div className="col-lg-12 mb-2">
                                        <Field label="Last Name" name="lastName" component={TextField} required />
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
}

export default withAuth(Product, [ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.SUPER_ADMIN])
