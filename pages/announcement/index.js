import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, Pagination, dialog } from '../../components'
import api from '../../services/webservice'
import { withAuth } from '../../services/auth'
import { ROLES, ANNOUNCE_STATUS } from '../../util/constants'
import Router from 'next/router'
import { formatDateTime } from '../../util/date-time-utilities'

const count = 10

export class Announcement extends Component {

    static async getInitialProps(ctx) {
        try {

            const res = await Promise.all([
                api.getAnnouncements({ keyword: '', page: 1, count }, ctx)
            ])

            const { announcementList, total } = res[0].data.result

            return {
                announcementList,
                total
            }

        } catch (error) {
            return {
                error,
                announcementList: [],
                total: 0
            }
        }
    }

    constructor(props) {
        super(props)
        this.delay = null
        const { announcementList, total } = props
        this.state = {
            announcementList,
            total,
            page: 1,
            keyword: ""
        }
    }

    onRemoveAnnouncement = (ann) => () => {
        dialog.showDialogConfirm({
            onConfirm: () => api.deleteAnnouncement(ann).then(() => {
                setTimeout(() => {
                    dialog.showDialogSuccess({
                        showConfirmButton: false
                    })
                    this.loadAnnouncements()
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

    loadAnnouncements = () => {
        const { keyword, page } = this.state
        api.getAnnouncements({
            keyword, page, count
        }).then(res => {
            const { announcementList, total } = res.data.result
            this.setState({ announcementList, total })
        })
    }

    onCreate = () => {
        Router.push('/announcement/[id]', '/announcement/create')
    }

    onEdit = (announcementID) => () => {
        Router.push('/announcement/[id]', '/announcement/' + announcementID)
    }

    onDelete = (announcementID) => () => {
        dialog.showDialogConfirm({
            message: 'Are you sure you want to delete this announcement?',
            onConfirm: () => {
                return api.deleteAnnouncement({ announcementID }).then(() => {
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            showConfirmButton: false,
                            onClose: () => this.loadAnnouncements(),
                            message: 'Deleted successfully'
                        })
                    }, 250)
                })
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.keyword !== this.state.keyword) {
            if (this.delay) {
                clearTimeout(this.delay)
                this.delay = null
            }

            this.delay = setTimeout(() => {
                this.loadAnnouncements()
            }, 250)
        } else if (prevState.page !== this.state.page) {
            this.loadAnnouncements()
        }
    }


    render() {

        const { announcementList, keyword, total, page } = this.state

        return (
            <MainLayout {...this.props}>
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Announcement</h1>
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
                                    <button onClick={this.onCreate} type="button" className="btn btn-block btn-danger my-3" ><i className="fas fa-plus mr-1" />Create</button>
                                </div>
                            </div>


                            <div className="table-responsive">
                                <ul className="list-group list-group-flush">
                                    {announcementList.map(ann => {
                                        return (
                                            <li className="list-group-item p-1 d-flex align-items-center justify-content-between" key={ann.announcementID}>
                                                <div>
                                                    <div className="text-dark font-weight-bold">{ann.name}</div>
                                                    <div className="small">
                                                        {ann.status === ANNOUNCE_STATUS.SEND ? (
                                                            <span className="text-success">Sent ({formatDateTime(ann.sendDate)})</span>
                                                        ) : (
                                                                <span>Draft</span>
                                                            )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <button type="button" onClick={this.onEdit(ann.announcementID)} className="btn btn-sm btn-outline-danger mr-1"><i className="fas fa-pen" /></button>
                                                    <button type="button" onClick={this.onDelete(ann.announcementID)} className="btn btn-sm btn-outline-danger"><i className="fas fa-trash" /></button>
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


                </div>
            </MainLayout>
        )
    }
}

export default withAuth(Announcement, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF])
