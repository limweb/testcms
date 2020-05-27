import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, Pagination, dialog, JqModal } from '../../components'
import api from '../../services/webservice'
import { withAuth } from '../../services/auth'
import Link from 'next/link'
import { formatDate } from '../../util/date-time-utilities'
import { Formik, Form, Field } from 'formik'
import { TextField } from '../../components/formik'
import { ROLES } from '../../util/constants'
import Ratio from 'react-ratio'

const count = 5

export class Campaign extends Component {

    static async getInitialProps(ctx) {
        try {

            const res = await Promise.all([
                api.getCampaigns({ keyword: '', page: 1, count }, ctx),
                // api.getAllExhibitors(ctx)
            ])

            const { campaignList, total } = res[0].data.result


            return {
                campaignList,
                total
            }

        } catch (error) {
            return {
                error,
                campaignList: [],
                total: 0
            }
        }
    }

    constructor(props) {
        super(props)
        this.delay = null
        const { campaignList, total } = props
        this.state = {
            campaignList,
            total,
            page: 1,
            keyword: ""
        }
    }


    onRemoveCampaign = (campaign) => () => {
        dialog.showDialogConfirm({
            message:'Are you sure you want to delete the campaign?',
            onConfirm: () => api.deleteCampaign(campaign).then(() => {
                setTimeout(() => {
                    dialog.showDialogSuccess({
                        message:'Successfully deleted',
                        showConfirmButton: false
                    })
                    this.loadCampaigns()
                }, 250)
            })
        })
    }


    onPageClick = (selectedPage) => {
        this.setState({ page: selectedPage })
    }

    onSearch = e => {
        this.setState({ keyword: e.target.value, page: 1 })
    }

    loadCampaigns = () => {
        const { keyword, page } = this.state
        api.getCampaigns({
            keyword, page, count
        }).then(res => {
            const { campaignList, total } = res.data.result
            this.setState({ campaignList, total })
        })
    }

    onCancelModal = (formik) => () => {
        this.modal.close()
        formik.resetForm()
    }

    onShowModal = () => {
        this.modal.show()
    }

    onCreateCampaign = (values, actions) => {
        api.createCampaign(values).then(() => {
            this.modal.close()
            actions.resetForm()
            dialog.showDialogSuccess({
                message:'Successfully created',
                showConfirmButton: false,
                onClose: () => this.loadCampaigns()
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.keyword !== this.state.keyword) {
            if (this.delay) {
                clearTimeout(this.delay)
                this.delay = null
            }

            this.delay = setTimeout(() => {
                this.loadCampaigns()
            }, 250)
        } else if (prevState.page !== this.state.page) {
            this.loadCampaigns()
        }
    }


    render() {

        const { campaignList, keyword, total, page } = this.state

        return (
            <MainLayout {...this.props}>
                <div className="d-sm-flex align-items-center justify-content-between mb-4" id="top">
                    <h1 className="h3 mb-0 text-gray-800">Campaign</h1>
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
                                    <button onClick={this.onShowModal} type="button" className="btn btn-block btn-danger my-3" ><i className="fas fa-plus mr-1" />Create</button>
                                </div>
                            </div>


                            <div className="table-responsive">
                                <ul className="list-unstyled">
                                    {campaignList.map(cmp => {
                                        return (
                                            <li className="media border hover-box-shadow p-2 mb-2" style={{ minWidth: '500px' }} key={cmp.campaignID}>
                                                
                                                <Ratio ratio={2 / 1.5} className="container-img-crop mr-3" style={{ width: '150px' }}>
                                                    <div className="container-item-campaign" style={{ backgroundImage: `url("${cmp.image}")` }} />
                                                    <img
                                                        width="100%" height="100%" style={{ objectFit: 'contain', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}
                                                        src={cmp.image || '../../static/img/noimage.jpg'}
                                                        alt={cmp.name}
                                                        className="rounded"
                                                        title={`${cmp.name}, ${cmp.startDate} - ${cmp.endDate}`}
                                                    />
                                                </Ratio>

                                                <div className="media-body">
                                                    <h5 className="mt-0 mb-1 font-weight-bold">{cmp.name}</h5>
                                                    <div className="row">
                                                        <div className="col-12"><strong className="mr-1">Date:</strong>{formatDate(cmp.startDate)} - {formatDate(cmp.endDate)}</div>
                                                        <div className="col-12"><strong className="mr-1">Status:</strong>{cmp.status ? <span className="text-success">Publish</span> : 'Unpublish'}</div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                        <button type="button" className="btn btn-danger" title="Remove" onClick={this.onRemoveCampaign(cmp)}>
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                        <Link href="/campaign/[campaignId]" as={`/campaign/${cmp.campaignID}`}>
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
                            </div>

                            <div className="col-md-12 p3">
                                <Pagination pageSize={count} length={3} currentPage={page} total={total} onClick={this.onPageClick} />
                            </div>

                        </Box>
                    </div>



                    <JqModal ref={ref => this.modal = ref} title="Create Campaign">
                        <Formik

                            initialValues={{
                                name: ""
                            }}
                            validate={(values) => {
                                const errors = {}
                                const required = ['name']

                                required.forEach(field => {
                                    if (!values[field]) {
                                        errors[field] = "Required"
                                    }
                                })
                                return errors
                            }}

                            onSubmit={(values, actions) => {
                                this.onCreateCampaign(values, actions)
                            }}
                        >

                            {(formik) => {
                                this.formik = formik
                                return (
                                    <Form className="p-3 mb-3">
                                        <div className="col-lg-12 mb-2">
                                            <Field label="Campaign Name" name="name" component={TextField} required />
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


                </div>
            </MainLayout>
        )
    }
}

export default withAuth(Campaign, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF])
