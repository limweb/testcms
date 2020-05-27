import React, { Component } from 'react'
import ExhibitorNav from '../../../components/layout/exhibitor-nav'
import MainLayout from '../../../components/layout/MainLayout'
import Router from 'next/router'
import { Box, Breadcrumb } from '../../../components'
import { withAuth } from '../../../services/auth'
import { ROLES } from '../../../util/constants'
import { getExhibitorID } from '..'
import { UniqueBusinessFunction, UniqueProductSourcing, BoothVisitor, UniqueProductVisitor, VisitorList } from '../../../components/chart/exhibitor'

const ARROW_UP = () => <i className="fas fa-long-arrow-alt-up text-success" />
const ARROW_DOWN = () => <i className="fas fa-long-arrow-alt-down text-danger" />
const SmallSuccessText = ({ children }) => (
    <span className="small text-success">{children}</span>
)
const SmallDangerText = ({ children }) => (
    <span className="small text-danger">{children}</span>
)

export class Dashboard extends Component {

    static async getInitialProps(ctx) {

        const exhibitId = getExhibitorID(ctx)

        return {
            exhibitId
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            keyword: ''
        }
    }

    onSearchChart = (e) => {
        this.setState({ keyword: e.target.value })
    }

    render() {

        const { account } = this.props
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

        const charts = [
            {
                id: 'booth-visitors',
                name: 'Booth Visitors',
                jsx: (
                    <div className="col-lg-12">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-10 m-0">Booth Visitors</h4>
                                        <div className="col-md-2">
                                            <select className="form-control">

                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '400px' }} className="pt-4">
                                        <BoothVisitor />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            },
            {
                id: 'unique-product-visitors',
                name: 'Unique Product Visitors',
                jsx: (
                    <div className="col-lg-12">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-10 m-0">Unique Product Visitors</h4>
                                        <div className="col-md-2">
                                            <select className="form-control">

                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '400px' }} className="pt-4">
                                        <UniqueProductVisitor />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'business-function-unique-visitors',
                name: 'Business Function (Unique Visitors)',
                jsx: (
                    <div className="col-lg-12">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-10 m-0">Business Function (Unique Visitors)</h4>
                                        <div className="col-md-2">
                                            <select className="form-control">

                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '400px' }} className="pt-4">
                                        <UniqueBusinessFunction />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'product-sourcing-unique-visitors',
                name: 'Product Sourcing (Unique Visitors)',
                jsx: (
                    <div className="col-lg-12">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-10 m-0">Product Sourcing (Unique Visitors)</h4>
                                        <div className="col-md-2">
                                            <select className="form-control">

                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '400px' }} className="pt-4">
                                        <UniqueProductSourcing />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'visitor-detail-list',
                name: 'Visitor Detail List',
                jsx: (
                    <div className="col-lg-12 pb-4">
                        <Box className="h-100">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-lg-9 col-md-7 col-sm-6 m-0">Visitor Detail List</h4>
                                        <div className="col-lg-2 col-md-3 col-sm-3">
                                            <select className="form-control">

                                            </select>

                                        </div>
                                        <button className="btn btn-outline-danger col-lg-1 col-md-2 col-sm-3">Export</button>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '100%' }} className="pt-3">
                                        <VisitorList />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }
        ]

        const filterCharts = charts.filter(chart => {
            const { keyword } = this.state
            const lowerCaseKeyword = keyword.toLowerCase()
            const lowerCaseName = chart.name.toLowerCase()
            return lowerCaseName.includes(lowerCaseKeyword)
        })

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Exhibitor's Dashboard</h1>
                    <div className="d-flex align-items-center justify-content-end row">
                        <button className="btn btn-outline-danger col-md-3 col-sm-4 col-xs-3">Export</button>
                        <div className="input-group col-md-9 col-sm-8">
                            <input onChange={this.onSearchChart} value={this.state.keyword} type="text" className="form-control bg-white border small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-danger" type="button">
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {account.roleName !== ROLES.EXHIBITOR ? (
                    <Breadcrumb links={links} />
                ) : <div className="mb-4" />}


                <div className="row">
                    <div className="col-md-12">
                        <Box>
                            {account.roleName !== ROLES.EXHIBITOR ? (
                                <ExhibitorNav currentTab="dashboard" exhibitorId={this.props.exhibitId} />
                            ) : ''}
                            <div className="col-md-12 p-3">




                                <div className="row">

                                    <div className="col-lg-4 mb-4">
                                        <div className="card border-left-danger shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-sm font-weight-bold text-uppercase mb-1">Total Visitors</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                            <span className="mr-2">{'40,000'}</span>
                                                            <ARROW_DOWN />
                                                            <SmallDangerText>12.45%</SmallDangerText>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-users fa-2x text-gray-300"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 mb-4">
                                        <div className="card border-left-danger shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-sm font-weight-bold text-uppercase mb-1">Unique Visitors</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                            <span className="mr-2">{'40,000'}</span>
                                                            <ARROW_UP />
                                                            <SmallSuccessText>12.45%</SmallSuccessText>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-user fa-2x text-gray-300"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 mb-4">
                                        <div className="card border-left-danger shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-sm font-weight-bold text-uppercase mb-1">Total Contact</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                            <span className="mr-2">{'40,000'}</span>
                                                            <ARROW_UP />
                                                            <SmallSuccessText>12.45%</SmallSuccessText>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-address-card fa-2x text-gray-300"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {filterCharts.map(chart => {
                                        return chart.jsx
                                    })}

                                </div>




                            </div>
                        </Box>
                    </div>
                </div>




            </MainLayout>
        )
    }
}

export default withAuth(Dashboard, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.EXHIBITOR])
