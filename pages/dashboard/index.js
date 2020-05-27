import React, { Component } from 'react'
import { withAuth } from '../../services/auth'
import { ROLES } from '../../util/constants'
import { Box, PickerRange, WorldMap, ExportVisitorList, ExportOverview } from '../../components'
import MainLayout from '../../components/layout/MainLayout'
import {
    VisitorVisitBooth, Exhibitors, Visitor,
    UniqueBusinessFunction, UniqueProductSourcing, HallVisitor,
    TopVisitedBooth, TopVisitContact, TopVisitProduct,
    VisitorList, AreaOfResponsibility, BusinessFunction,
    ProductSourcing,
    FirstVisitor,
    VisitorFrom, VisitorPurpose, TopVisitedCountry
} from '../../components/chart/organizer'
import api from '../../services/webservice'
import { addDays } from 'date-fns'
import moment from 'moment'
import { formatIntegerNumber } from '../../util/utilities'
import { formatDateRangeObject } from '../../util/date-time-utilities'
import Link from 'next/link'

const defaultDateRange = {
    startDate: moment(addDays(new Date(), -90)).format('DD-MM-YYYY'),
    endDate: moment().format('DD-MM-YYYY')
}

const count = 10

export class Dashboard extends Component {

    static async getInitialProps(ctx) {
        try {
            const res = await Promise.all([
                api.getTotal(ctx),
                api.getOriginVisitor({ ...defaultDateRange }, ctx),
                api.getOriginExhibitor({ ...defaultDateRange }, ctx),
                api.getTotalVisitorByBooth({ ...defaultDateRange }, ctx),
                api.getTopVisitorByCountry({ ...defaultDateRange, page: 1, count }, ctx),
                api.getUniqueBusinessFunction({ ...defaultDateRange }, ctx),
                api.getVisitorByHall({ ...defaultDateRange }, ctx),
                api.getTopVisitedBooth({ ...defaultDateRange, page: 1, count }, ctx),
                api.getTopVisitedContact({ ...defaultDateRange, page: 1, count }, ctx),
                api.getTopVisitedProduct({ ...defaultDateRange, page: 1, count }, ctx),
                api.getUniqueProductSourcing({ ...defaultDateRange }, ctx),
                api.getVisitorList({ ...defaultDateRange, page: 1, count }, ctx)
            ])

            const total = res[0].data.result
            const originVisitor = res[1].data.result
            const originExhibitor = res[2].data.result
            const totalVisitorByBooth = res[3].data.result
            const topVisitorByCountry = res[4].data.result
            const uniqueBusinessFunction = res[5].data.result
            const visitorByHall = res[6].data.result
            const topVisitedBooth = res[7].data.result
            const topVisitedContact = res[8].data.result
            const topVisitedProduct = res[9].data.result
            const uniqueProductSourcing = res[10].data.result
            const visitorList = res[11].data.result

            return {
                total,
                originVisitor,
                originExhibitor,
                totalVisitorByBooth,
                topVisitorByCountry,
                uniqueBusinessFunction,
                visitorByHall,
                topVisitedBooth,
                topVisitedContact,
                topVisitedProduct,
                uniqueProductSourcing,
                visitorList
            }
        } catch (error) {
            return {
                error,
                total: {},
                originVisitor: {},
                originExhibitor: {},
                totalVisitorByBooth: [],
                topVisitorByCountry: { visitorCountryList: [], total: 0 },
                uniqueBusinessFunction: [],
                visitorByHall: [],
                topVisitedBooth: { boothList: [], total: 0 },
                topVisitedContact: { contactList: [], total: 0 },
                topVisitedProduct: { productList: [], total: 0 },
                uniqueProductSourcing: [],
                visitorList: { visitorList: [], total: 0 }
            }
        }
    }


    constructor(props) {
        super(props)
        console.log(props);

        const {
            total, originVisitor, originExhibitor,
            totalVisitorByBooth, topVisitorByCountry, uniqueBusinessFunction,
            visitorByHall, topVisitedBooth, topVisitedContact, topVisitedProduct,
            uniqueProductSourcing, visitorList
        } = props
        this.state = {
            keyword: '',
            total,
            originVisitor, originVisitorDate: defaultDateRange,
            originExhibitor, originExhibitorDate: defaultDateRange,
            totalVisitorByBooth, totalVisitorByBoothDate: defaultDateRange,
            topVisitorByCountry, topVisitorByCountryDate: defaultDateRange,
            uniqueBusinessFunction, uniqueBusinessFunctionDate: defaultDateRange,
            visitorByHall, visitorByHallDate: defaultDateRange,
            topVisitedBooth, topVisitedBoothDate: defaultDateRange,
            topVisitedContact, topVisitedContactDate: defaultDateRange,
            topVisitedProduct, topVisitedProductDate: defaultDateRange,
            uniqueProductSourcing, uniqueProductSourcingDate: defaultDateRange,
            visitorList, visitorListDate: defaultDateRange
        }

        
    }

    onSearch = (e) => {
        this.setState({ keyword: e.target.value })
    }

    fetchTotal = () => {
        api.getTotal().then(res => {
            this.setState({ total: res.data.result })
        })
    }

    fetchOriginVisitor = (params) => {
        api.getOriginVisitor(params).then(res => {
            this.setState({ originVisitor: res.data.result, originVisitorDate: params })
        })
    }

    fetchOriginExhibitor = (params) => {
        api.getOriginExhibitor(params).then(res => {
            this.setState({ originExhibitor: res.data.resultม, originExhibitorDate: params })
        })
    }

    fetchVisitorByBooth = (params) => {
        api.getTotalVisitorByBooth(params).then(res => {
            this.setState({ totalVisitorByBooth: res.data.result, totalVisitorByBoothDate: params })
        })
    }

    fetchTopVisitorByCountry = (params) => {
        api.getTopVisitorByCountry(params).then(res => {
            this.setState({ topVisitorByCountry: res.data.result, topVisitorByCountryDate: params })
        })
    }

    fetchUniqueBusinessFunction = (params) => {
        api.getUniqueBusinessFunction(params).then(res => {
            this.setState({ uniqueBusinessFunction: res.data.result, uniqueBusinessFunctionDate: params })
        })
    }

    fetchUniqueProductSourcing = (params) => {
        api.getUniqueProductSourcing(params).then(res => {
            this.setState({ uniqueProductSourcing: res.data.result, uniqueProductSourcingDate: params })
        })
    }

    fetchVisitorByHall = (params) => {
        api.getVisitorByHall(params).then(res => {
            this.setState({ visitorByHall: res.data.result, visitorByHallDate: params })
        })
    }

    fetchTopVisitedBooth = (params) => {
        api.getTopVisitedBooth(params).then(res => {
            this.setState({ topVisitedBooth: res.data.result, topVisitedBoothDate: params })
        })
    }

    fetchTopVisitedContact = (params) => {
        api.getTopVisitedContact(params).then(res => {
            this.setState({ topVisitedContact: res.data.result, topVisitedContactDate: params })
        })
    }

    fetchTopVisitedProduct = (params) => {
        api.getTopVisitedProduct(params).then(res => {
            this.setState({ topVisitedProduct: res.data.result, topVisitedProductDate: params })
        })
    }

    fetchVisitorList = (params) => {
        api.getVisitorList(params).then(res => {
            this.setState({ visitorList: res.data.result, visitorListDate: params })
        })
    }

    render() {

        const { keyword, originExhibitor, originVisitor,
            topVisitorByCountry, total, totalVisitorByBooth,
            uniqueBusinessFunction, visitorByHall, topVisitedBooth,
            topVisitedContact, topVisitedProduct, uniqueProductSourcing,
            visitorList,

            originExhibitorDate, originVisitorDate, topVisitedBoothDate,
            topVisitedContactDate, topVisitedProductDate, topVisitorByCountryDate,
            totalVisitorByBoothDate, uniqueBusinessFunctionDate, uniqueProductSourcingDate,
            visitorByHallDate, visitorListDate
        } = this.state

        const charts = [
            {
                id: 'origin-of-visitors',
                name: 'Origin of Visitors',
                jsx: (
                    <div className="col-lg-6" key="origin-of-visitors">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-8 m-0">Origin of Visitors</h4>
                                        <div className="col-md-4">
                                            <PickerRange onSelectDate={(date) => {
                                                this.fetchOriginVisitor(formatDateRangeObject(date.date))
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div style={{ width: '100%', height: '250px' }}>
                                        <Visitor oversea={originVisitor.oversea} total={originVisitor.total} local={originVisitor.local} />
                                    </div>
                                </div>
                                <div className="col-lg-5 d-flex flex-column justify-content-center">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <div style={{ height: '20px', width: '20px', borderRadius: '10px', backgroundColor: '#ee3135' }} className="mr-2" />
                                            <div>Oversea</div>
                                        </div>
                                        <div >{formatIntegerNumber(originVisitor.oversea)}</div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div style={{ height: '20px', width: '20px', borderRadius: '10px', backgroundColor: '#999' }} className="mr-2" />
                                            <div>Local</div>
                                        </div>
                                        <div>{formatIntegerNumber(originVisitor.local)}</div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'origin-of-exhibitors',
                name: 'Origin of Exhibitors',
                jsx: (
                    <div className="col-lg-6" key="origin-of-exhibitors">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-8 m-0">Origin of Exhibitors</h4>
                                        <div className="col-md-4">
                                            <PickerRange onSelectDate={(date) => {
                                                this.fetchOriginExhibitor(formatDateRangeObject(date.date))
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div style={{ width: '100%', height: '250px' }}>
                                        <Exhibitors oversea={originExhibitor.oversea} total={originExhibitor.total} local={originExhibitor.local} />
                                    </div>
                                </div>
                                <div className="col-lg-5 d-flex flex-column justify-content-center">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <div style={{ height: '20px', width: '20px', borderRadius: '10px', backgroundColor: '#ee3135' }} className="mr-2" />
                                            <div>Oversea</div>
                                        </div>
                                        <div >{formatIntegerNumber(originExhibitor.oversea)}</div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div style={{ height: '20px', width: '20px', borderRadius: '10px', backgroundColor: '#999' }} className="mr-2" />
                                            <div>Local</div>
                                        </div>
                                        <div>{formatIntegerNumber(originExhibitor.local)}</div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'total-visitors-visit-booth',
                name: 'Total visitors visit booth',
                jsx: (
                    <div className="col-lg-7 pb-4" key="total-visitors-visit-booth">
                        <Box className="h-100">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-9 m-0">Total visitors visit booth</h4>
                                        <div className="col-md-3">
                                            <PickerRange onSelectDate={(date) => {
                                                this.fetchVisitorByBooth(formatDateRangeObject(date.date))
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '420px' }} className="mt-4">
                                        <VisitorVisitBooth data={totalVisitorByBooth} />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'top-10-visitor-by-country',
                name: 'Top 10 visitor by country',
                jsx: (
                    <div className="col-lg-5 pb-4" key="top-10-visitor-by-country">
                        <Box className="h-100" bodyClassName="pb-0">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-8 m-0">Top 10 visitor by country</h4>
                                        <div className="col-md-4">
                                            <PickerRange onSelectDate={({ date }) => {
                                                this.fetchTopVisitorByCountry({ ...formatDateRangeObject(date), page: 1, count })
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <WorldMap data={topVisitorByCountry} />
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '100%' }}>
                                        <TopVisitedCountry data={topVisitorByCountry} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <Link href="/dashboard/top-visitor-country">
                                    <a href="#">Show more</a>
                                </Link>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'unique-business-function',
                name: 'Business Function (Unique Visitors)',
                jsx: (
                    <div className="col-lg-12" key="unique-business-function">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-10 m-0">Business Function (Unique Visitors)</h4>
                                        <div className="col-md-2">
                                            <PickerRange onSelectDate={(date) => {
                                                this.fetchUniqueBusinessFunction(formatDateRangeObject(date.date))
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '400px' }} className="pt-4">
                                        <UniqueBusinessFunction data={uniqueBusinessFunction} />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'unique-product-sourcing',
                name: 'Products sourcing (Unique Visitors)',
                jsx: (
                    <div className="col-lg-12" key="unique-product-sourcing">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-10 m-0">Products sourcing (Unique Visitors)</h4>
                                        <div className="col-md-2">
                                            <PickerRange onSelectDate={({ date }) => {
                                                this.fetchUniqueProductSourcing(formatDateRangeObject(date))
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '400px' }} className="pt-4">
                                        <UniqueProductSourcing data={uniqueProductSourcing} />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'visit-by-hall',
                name: 'Visitor by Hall',
                jsx: (
                    <div className="col-lg-7" key="visit-by-hall">
                        <Box bodyClassName="">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-9 m-0">Visitor by Hall</h4>
                                        <div className="col-md-3">
                                            <PickerRange onSelectDate={(date) => {
                                                this.fetchVisitorByHall(formatDateRangeObject(date.date))
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '320px' }} className="mt-4">
                                        <HallVisitor data={visitorByHall} />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'top-10-visit-booth',
                name: 'Top 10 Visited Booth',
                jsx: (
                    <div className="col-lg-5 pb-4" key="top-10-visit-booth">
                        <Box className="h-100" bodyClassName="pb-0">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-8 m-0">Top 10 Visited Booths</h4>
                                        <div className="col-md-4">
                                            <PickerRange onSelectDate={({ date }) => {
                                                this.fetchTopVisitedBooth({ ...formatDateRangeObject(date), page: 1, count })
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '100%' }} className="pt-3">
                                        <TopVisitedBooth data={topVisitedBooth} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <Link href="/dashboard/top-visited-booth">
                                    <a href="#">Show more</a>
                                </Link>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'top-10-visit-contact',
                name: 'Top 10 Visitor Contact',
                jsx: (
                    <div className="col-lg-6 pb-4" key="top-10-visit-contact">
                        <Box className="h-100" bodyClassName="pb-0">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-8 m-0">Top 10 Visitor Contacts</h4>
                                        <div className="col-md-4">
                                            <PickerRange onSelectDate={({ date }) => {
                                                this.fetchTopVisitedContact({ ...formatDateRangeObject(date), page: 1, count })
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '100%' }} className="pt-3">
                                        <TopVisitContact data={topVisitedContact} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <Link href="/dashboard/top-visited-contact">
                                    <a href="#">Show more</a>
                                </Link>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'top-10-visit-by-product',
                name: 'Top 10 Visited by Products',
                jsx: (
                    <div className="col-lg-6 pb-4" key="top-10-visit-by-product">
                        <Box className="h-100" bodyClassName="pb-0">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-8 m-0">Top 10 Visited Products</h4>
                                        <div className="col-md-4">
                                            <PickerRange onSelectDate={({ date }) => {
                                                this.fetchTopVisitedProduct({ ...formatDateRangeObject(date), page: 1, count })
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '100%' }} className="pt-3">
                                        <TopVisitProduct data={topVisitedProduct} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <Link href="/dashboard/top-visited-product">
                                    <a href="#">Show more</a>
                                </Link>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'visitor-list',
                name: 'Visitors detail list',
                jsx: (
                    <div className="col-lg-12 pb-4" key="visitor-list">
                        <Box className="h-100" bodyClassName="pb-0">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-baseline">
                                        <h4 className="col-lg-8 col-md-7 col-sm-6 m-0">Visitor Detail List</h4>
                                        <div className="col-lg-2 col-md-3 col-sm-3">
                                            <PickerRange onSelectDate={({ date }) => {
                                                this.fetchVisitorList({ ...formatDateRangeObject(date), page: 1, count })
                                            }} />

                                        </div>
                                        <div className="col-lg-2 col-md-2 col-sm-3">
                                            <ExportVisitorList className="btn btn-outline-danger btn-block" data={visitorList} date={visitorListDate} />
                                        </div>

                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '100%' }} className="pt-3">
                                        <VisitorList data={visitorList} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <Link href="/dashboard/visitor-list">
                                    <a href="#">Show more</a>
                                </Link>
                            </div>
                        </Box>
                    </div>
                )
            },
        ]

        const questionReports = [
            {
                id: 'area-of-responsibility',
                name: 'Area of Responsibility',
                jsx: (
                    <div className="col-lg-6" key="area-of-responsibility">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-9 m-0">Area of Responsibility</h4>
                                        <div className="col-md-3">
                                            <PickerRange onSelectDate={({ date }) => {
                                                console.log(formatDateRangeObject(date));

                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '320px' }} className="mt-4">
                                        <AreaOfResponsibility />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'is-the-first-visit',
                name: 'Is this the first visit by your company to the fair?',
                jsx: (
                    <div className="col-lg-6 pb-4" key="is-the-first-visit">
                        <Box className="h-100">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-9 m-0">Is this the first visit by your company to the fair?</h4>
                                        <div className="col-md-3">
                                            <PickerRange onSelectDate={({ date }) => {
                                                console.log(formatDateRangeObject(date));

                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div style={{ width: '100%', height: '320px' }}>
                                        <FirstVisitor />
                                    </div>
                                </div>
                                <div className="col-lg-5 d-flex flex-column justify-content-center">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <div style={{ height: '20px', width: '20px', borderRadius: '10px', backgroundColor: '#ee3135' }} className="mr-2" />
                                            <div>Yes</div>
                                        </div>
                                        <div >14,200</div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div style={{ height: '20px', width: '20px', borderRadius: '10px', backgroundColor: '#999' }} className="mr-2" />
                                            <div>No</div>
                                        </div>
                                        <div>14,200</div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'buss-func',
                name: 'Business Function',
                jsx: (
                    <div className="col-lg-12" key="buss-func">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-10 m-0">Business Function</h4>
                                        <div className="col-md-2">
                                            <PickerRange onSelectDate={({ date }) => {
                                                console.log(formatDateRangeObject(date));

                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '400px' }} className="pt-4">
                                        <BusinessFunction />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'prod-source',
                name: 'Products sourcing',
                jsx: (
                    <div className="col-lg-12" key="prod-source">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-10 m-0">Products sourcing</h4>
                                        <div className="col-md-2">
                                            <PickerRange onSelectDate={({ date }) => {
                                                console.log(formatDateRangeObject(date));

                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '400px' }} className="pt-4">
                                        <ProductSourcing />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'visitor-purpose',
                name: 'Please indicate the purpose(s) of your visit',
                jsx: (
                    <div className="col-lg-6" key="visitor-purpose">
                        <Box>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-9 m-0">Please indicate the purpose(s) of your visit</h4>
                                        <div className="col-md-3">
                                            <PickerRange onSelectDate={({ date }) => {
                                                console.log(formatDateRangeObject(date));

                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div style={{ width: '100%', height: '500px' }} className="mt-4">
                                        <VisitorPurpose />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            }, {
                id: 'visitor-come-from',
                name: 'Visitor from?',
                jsx: (
                    <div className="col-lg-6 pb-4" key="visitor-come-from">
                        <Box className="h-100">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row d-flex align-items-center">
                                        <h4 className="col-md-9 m-0">Visitor from?</h4>
                                        <div className="col-md-3">
                                            <PickerRange onSelectDate={({ date }) => {
                                                console.log(formatDateRangeObject(date));

                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div style={{ width: '100%', height: '500px' }}>
                                        <VisitorFrom />
                                    </div>
                                </div>
                                <div className="col-lg-5 d-flex flex-column justify-content-center">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <div style={{ height: '20px', width: '20px', borderRadius: '10px', backgroundColor: '#ee3135' }} className="mr-2" />
                                            <div>Internet</div>
                                        </div>
                                        <div >400</div>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <div style={{ height: '20px', width: '20px', borderRadius: '10px', backgroundColor: '#999' }} className="mr-2" />
                                            <div>Invitation</div>
                                        </div>
                                        <div>300</div>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <div style={{ height: '20px', width: '20px', borderRadius: '10px', backgroundColor: '#000' }} className="mr-2" />
                                            <div>Media</div>
                                        </div>
                                        <div>700</div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                )
            },
        ]

        const chartNames = [
            ...charts.map(c => c.name),
            ...questionReports.map(q => q.name)
        ]

        const filterCharts = charts.filter(chart => {
            const { keyword } = this.state
            const lowerCaseKeyword = keyword.toLowerCase()
            const lowerCaseName = chart.name.toLowerCase()
            return lowerCaseName.includes(lowerCaseKeyword)
        })

        const filterQuestionReports = questionReports.filter(chart => {
            const { keyword } = this.state
            const lowerCaseKeyword = keyword.toLowerCase()
            const lowerCaseName = chart.name.toLowerCase()
            return lowerCaseName.includes(lowerCaseKeyword)
        })

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Overview</h1>
                    <div className="d-flex align-items-center justify-content-end row">
                        <div className="col-md-4 my-3">
                            <ExportOverview pageState={this.state} className="btn btn-outline-danger btn-block" />
                        </div>

                        <div className="input-group col-md-8 my-3">
                            <input onChange={this.onSearch} value={keyword} type="text" className="form-control bg-white border small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-danger" type="button">
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">

                    <div className="col-lg-4 mb-4">
                        <div className="card border-left-danger shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-sm font-weight-bold text-uppercase mb-1">Total Visitors</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                            <span className="mr-2">{formatIntegerNumber(total.totalVistor)}</span>
                                            {/* <ARROW_DOWN />
                                            <SmallDangerText>12.45%</SmallDangerText> */}
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
                                        <div className="text-sm font-weight-bold text-uppercase mb-1">Exhibitor Company</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                            <span className="mr-2">{formatIntegerNumber(total.totalExhibitor)}</span>
                                            {/* <ARROW_UP />
                                            <SmallSuccessText>12.45%</SmallSuccessText> */}
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-address-card fa-2x text-gray-300"></i>
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
                                        <div className="text-sm font-weight-bold text-uppercase mb-1">Total</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                            <span className="mr-2">{formatIntegerNumber(total.total)}</span>
                                            {/* <ARROW_UP />
                                            <SmallSuccessText>12.45%</SmallSuccessText> */}
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-chart-bar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filterCharts.map(c => c.jsx)}


                </div>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Question naire</h1>
                </div>

                <div className="row">

                    {filterQuestionReports.map(c => c.jsx)}

                </div>

            </MainLayout >
        )
    }
}

export default withAuth(Dashboard, [ROLES.ORGANIZER, ROLES.SUPER_ADMIN])
