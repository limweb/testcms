import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, Pagination, PickerRange, Breadcrumb, ExportVisitorList } from '../../components'
import { withAuth } from '../../services/auth'
import api from '../../services/webservice'
import { ROLES } from '../../util/constants'
import { formatDateRangeObject, formatDateTime } from '../../util/date-time-utilities'
import moment from 'moment'
import { addDays } from 'date-fns'

const count = 10

const defaultDateRange = {
    startDate: moment(addDays(new Date(), -90)).format('DD-MM-YYYY'),
    endDate: moment().format('DD-MM-YYYY')
}

export class VisitorList extends Component {

    static async getInitialProps(ctx) {

        try {
            const res = await api.getVisitorList({ ...defaultDateRange, page: 1, count }, ctx)
            const { total, visitorList } = res.data.result
            const res2 = await api.getVisitorList({ ...defaultDateRange, page: 1, count: total }, ctx)
            const { visitorList: allVisitors } = res2.data.result
            return {
                total,
                visitorList,
                allVisitors
            }
        } catch (error) {
            return {
                error,
                total: 0,
                visitorList: [],
                allVisitors: []
            }
        }
    }

    constructor(props) {

        super(props)
        this.delay
        this.state = {
            page: 1,
            total: props.total,
            visitorList: props.visitorList,
            allVisitors: props.allVisitors,
            dateRange: defaultDateRange
        }
    }


    onPageSelect = (selectedPage) => {
        this.setState({ page: selectedPage })
    }

    fetchVisitorList = () => {
        const { page, dateRange } = this.state
        api.getVisitorList({
            page,
            ...dateRange,
            count
        }).then(res => {
            api.getVisitorList({
                page: 1,
                ...dateRange,
                count: parseInt(res.data.result.total) + 1
            }).then(res2 => {
                this.setState({
                    total: res.data.result.total,
                    visitorList: res.data.result.visitorList,
                    allVisitors: res2.data.result.visitorList
                })
            })
        })
    }

    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.page !== this.state.page || prevStates.dateRange !== this.state.dateRange) {
            this.fetchVisitorList()
        }
    }

    render() {

        const { visitorList, page, total, allVisitors, dateRange } = this.state

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Visitor Detail List</h1>
                </div>

                <Breadcrumb links={[
                    {
                        href: '/dashboard',
                        label: 'Dashboard',
                        active: false
                    }, {
                        href: '/',
                        label: 'List',
                        active: true
                    }
                ]} />

                <div className="row">

                    <div className="col-md-12">
                        <Box>

                            <div className="row ">

                                <div className="col-md-4 col-lg-2 mb-3" >
                                    <PickerRange onSelectDate={({ date }) => {
                                        this.setState({ dateRange: formatDateRangeObject(date), page: 1 })
                                    }} />
                                </div>
                                <div className="col-md-5 col-lg-8" />
                                <div className="col-md-3 col-lg-2 mb-3 mt-2">
                                    <ExportVisitorList data={{ visitorList: allVisitors }} date={dateRange} className="btn btn-outline-danger btn-block" />
                                </div>

                            </div>


                            <table className="table table-sm table-borderless">
                                <thead>
                                    <tr style={{ backgroundColor: 'rgb(245,246,250)' }} className="align-middle">
                                        <th className="text-left" scope="col">#</th>
                                        <th className="text-center" scope="col">Name</th>
                                        <th className="text-center" scope="col">Company</th>
                                        <th className="text-center" scope="col">Country</th>
                                        <th className="text-center" scope="col">Business Type</th>
                                        <th className="text-right" scope="col">Last Online</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitorList.map((v, index) => {
                                        const { visitorID, name, companyName, countryName, businessType, lastOnline } = v
                                        return (
                                            <tr className="align-middle" key={visitorID}>
                                                <td className="text-left">{index + 1}</td>
                                                <td className="text-center">{name}</td>
                                                <td className="text-center">{companyName}</td>
                                                <td className="text-center">{countryName}</td>
                                                <td className="text-center">{businessType}</td>
                                                <td className="text-right">{formatDateTime(lastOnline)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>



                            <div className="col-md-12 p3">
                                <Pagination pageSize={count} length={3} currentPage={page} total={total} onClick={this.onPageSelect} />
                            </div>
                        </Box>
                    </div>

                </div>




            </MainLayout>
        )
    }

}


export default withAuth(VisitorList, [ROLES.ORGANIZER, ROLES.SUPER_ADMIN])