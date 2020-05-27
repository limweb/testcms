import React, { Component } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { Box, Pagination } from '../../components'
import Link from 'next/link'
import { withAuth, getAuth } from '../../services/auth'
import api from '../../services/webservice'
import { formatRoleList, capitalize } from '../../util/utilities'
import { EXHIBITOR_STATUS, ROLES } from '../../util/constants'

const count = 5

export function getExhibitorID(ctx) {
    const { account } = getAuth(ctx)
    if (account && (account.roleName === ROLES.EXHIBITOR || account.roleName === ROLES.EXHIBITOR)) {
        return account.accountID
    } else {
        return ctx.query.id
    }
}

class ExhibitorList extends Component {

    static async getInitialProps(ctx) {
        try {
            const res = await api.getExhibitors({ page: 1, count, keyword: "" }, ctx)
            const roleRes = await api.getAllRole(ctx)
            const total = res.data.result.total
            const exhibitorList = res.data.result.exhibitorList
            return {
                total,
                exhibitorList,
                roles: roleRes.data.result
            }
        } catch (error) {
            return {
                error,
                exhibitorList: [],
                total: 1,
                roles: []
            }
        }
    }

    constructor(props) {
        super(props)
        this.delay = null
        this.state = {
            page: 1,
            keyword: "",
            total: props.total,
            exhibitorList: props.exhibitorList
        }
    }

    onPageSelect = (selectedPage) => {
        this.setState({ page: selectedPage })
    }

    onSearch = (e) => {
        this.setState({ page: 1, keyword: e.target.value })
    }

    loadExhibitors = () => {
        const { page, keyword } = this.state
        api.getExhibitors({ count, page, keyword }).then(res => {
            const total = res.data.result.total
            const exhibitorList = res.data.result.exhibitorList
            this.setState({ total, exhibitorList })
        })
    }

    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.keyword !== this.state.keyword) {
            if (this.delay) {
                clearTimeout(this.delay)
                this.delay = null
            }
            this.delay = setTimeout(() => {
                this.loadExhibitors()
            }, 400)
        } else if (prevStates.page !== this.state.page) {
            this.loadExhibitors()
        }
    }

    render() {

        const { page, total, exhibitorList } = this.state
        const { roles } = this.props
        const getRole = formatRoleList(roles)

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Exhibitor</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <div className="col-md-12 p-3">

                                <div className="input-group mb-3">
                                    <input onChange={this.onSearch} type="text" className="form-control bg-light border small col-md-6 " placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <button className="btn btn-danger" type="button">
                                            <i className="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>

                                <ul className="list-unstyled">
                                    {exhibitorList.map(item => {
                                        const { id, imgageLogo, companyName, role, userEmail, status } = item
                                        return (
                                            <Link href="/exhibitor/[id]" as={`/exhibitor/${id}`} key={id}>
                                                <li className="media border hover-box-shadow p-2 mb-2 cursor-pointer">
                                                    <img className="mr-3 border list-img" src={imgageLogo || '../../static/img/noimage.jpg'} alt="Generic placeholder image" />
                                                    <div className="media-body">
                                                        <h5 className="mt-0 mb-1 font-weight-bold">{companyName}</h5>
                                                        <div className="row">
                                                            <div className="col-12"><strong className="mr-1">Role:</strong>{getRole[role]}</div>
                                                            <div className="col-12"><strong className="mr-1">Email:</strong>{userEmail}</div>
                                                            <div className="col-12"><strong className={`mr-1`}>Status:</strong>
                                                                <span className={`${status === EXHIBITOR_STATUS.ACTIVE ? 'text-success' : ''}`}>{capitalize(status)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </Link>
                                        )
                                    })}
                                </ul>


                            </div>

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

export default withAuth(ExhibitorList, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF])
