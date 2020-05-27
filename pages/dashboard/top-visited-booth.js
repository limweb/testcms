import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, Pagination, PickerRange, Breadcrumb, ExportTopVisitedBooth } from '../../components'
import { withAuth } from '../../services/auth'
import api from '../../services/webservice'
import { ROLES } from '../../util/constants'
import { formatDateRangeObject } from '../../util/date-time-utilities'
import moment from 'moment'
import { addDays } from 'date-fns'
import { formatIntegerNumber } from '../../util/utilities'

const count = 10

const defaultDateRange = {
    startDate: moment(addDays(new Date(), -90)).format('DD-MM-YYYY'),
    endDate: moment().format('DD-MM-YYYY')
}

export class TopVisitedBooth extends Component {

    static async getInitialProps(ctx) {

        try {

            const res1 = await api.getTopVisitedBooth({ ...defaultDateRange, page: 1, count }, ctx)
            const { total, boothList } = res1.data.result
            const res2 = await api.getTopVisitedBooth({ ...defaultDateRange, page: 1, count: total }, ctx)
            const { boothList: allBooths } = res2.data.result

            return {
                total,
                boothList,
                allBooths
            }
        } catch (error) {
            return {
                error,
                total: 0,
                boothList: [],
                allBooths: []
            }
        }
    }

    constructor(props) {
        super(props)
        this.delay
        this.state = {
            page: 1,
            total: props.total,
            boothList: props.boothList,
            allBooths: props.allBooths,
            dateRange: defaultDateRange
        }
    }

    onPageSelect = (selectedPage) => {
        this.setState({ page: selectedPage })
    }

    fetchTopVisitedBooth = () => {
        const { page, dateRange } = this.state
        api.getTopVisitedBooth({
            page,
            ...dateRange,
            count
        }).then(res1 => {
            api.getTopVisitedBooth({
                page: 1,
                ...dateRange,
                count: parseInt(res1.data.result.total) + 1
            }).then(res2 => {
                this.setState({
                    total: res1.data.result.total,
                    boothList: res1.data.result.boothList,
                    allBooths: res2.data.result.boothList
                })
            })
        })
    }

    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.page !== this.state.page || prevStates.dateRange !== this.state.dateRange) {
            this.fetchTopVisitedBooth()
        }
    }

    render() {

        const { boothList, page, total, allBooths, dateRange } = this.state

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Top 10 Visited Booths</h1>
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
                                    <ExportTopVisitedBooth data={allBooths} date={dateRange} className="btn btn-outline-danger btn-block" />
                                </div>

                            </div>


                            <table className="table table-sm table-borderless">
                                <thead>
                                    <tr style={{ backgroundColor: 'rgb(245,246,250)' }}>
                                        <th className="text-left" scope="col">#</th>
                                        <th className="text-left" scope="col">Company</th>
                                        <th className="text-right" scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boothList.map((b, index) => {
                                        const { exhibitorName, total, image } = b
                                        return (
                                            <tr className="align-middle" key={index}>
                                                <td className="text-left align-middle">{index + 1}</td>
                                                <td className="text-left align-middle">
                                                    <img
                                                        src={image || "../../../static/img/noimage.jpg"}
                                                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                                                        className="mr-1 border"
                                                        alt={exhibitorName}
                                                        title={exhibitorName} />
                                                    <span title={exhibitorName}>{exhibitorName}</span>
                                                </td>
                                                <td className="text-right align-middle">{formatIntegerNumber(total)}</td>
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


export default withAuth(TopVisitedBooth, [ROLES.ORGANIZER, ROLES.SUPER_ADMIN])