import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, Pagination, PickerRange, Breadcrumb, ExportTopVisitedContact } from '../../components'
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

export class TopVisitedContact extends Component {

    static async getInitialProps(ctx) {

        try {
            const res = await api.getTopVisitedContact({ ...defaultDateRange, page: 1, count }, ctx)
            const { total, contactList } = res.data.result
            const res2 = await api.getTopVisitedContact({ ...defaultDateRange, page: 1, count: total }, ctx)
            const { contactList: allContacts } = res2.data.result
            return {
                total,
                contactList,
                allContacts
            }
        } catch (error) {
            return {
                error,
                total: 0,
                contactList: [],
                allContacts: []
            }
        }
    }

    constructor(props) {

        super(props)
        this.delay
        this.state = {
            page: 1,
            total: props.total,
            contactList: props.contactList,
            allContacts: props.allContacts,
            dateRange: defaultDateRange
        }
    }


    onPageSelect = (selectedPage) => {
        this.setState({ page: selectedPage })
    }

    fetchTopVisitedContact = () => {
        const { page, dateRange } = this.state
        api.getTopVisitedContact({
            page,
            ...dateRange,
            count
        }).then(res => {
            api.getTopVisitedContact({
                page: 1,
                count: parseInt(res.data.result.total) + 1,
                ...dateRange
            }).then(res2 => {
                this.setState({
                    total: res.data.result.total,
                    contactList: res.data.result.contactList,
                    allContacts: res2.data.result.contactList
                })
            })
        })
    }

    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.page !== this.state.page || prevStates.dateRange !== this.state.dateRange) {
            this.fetchTopVisitedContact()
        }
    }

    render() {

        const { contactList, page, total, allContacts, dateRange } = this.state

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Top 10 Visitor Contacts</h1>
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
                                    <ExportTopVisitedContact data={allContacts} date={dateRange} className="btn btn-outline-danger btn-block" />
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
                                    {contactList.map((b, index) => {
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


export default withAuth(TopVisitedContact, [ROLES.ORGANIZER, ROLES.SUPER_ADMIN])