import React, { Component } from 'react'
import MainLayout from '../../../components/layout/MainLayout'
import ExhibitorNav from '../../../components/layout/exhibitor-nav'
import Router from 'next/router'
import { Box, PdfThumbnail, Breadcrumb } from '../../../components'
import { withAuth } from '../../../services/auth'
import api from '../../../services/webservice'
import { formatRoleList } from '../../../util/utilities'
import { ROLES } from '../../../util/constants'
import { getExhibitorID } from '..'

export class ExhibitorInfo extends Component {

    static async getInitialProps(ctx) {

        try {
            const exhibitorID = getExhibitorID(ctx)
            const res = await api.getExhibitorDetail({ exhibitorID }, ctx)
            const roleRes = await api.getAllRole(ctx)

            return {
                exhibitorID,
                exhibitorDetail: res.data.result,
                roles: roleRes.data.result
            }

        } catch (error) {
            return {
                error,
                exhibitorID: "",
                exhibitorDetail: {},
                roles: []
            }
        }
    }

    constructor(props) {
        super(props)
    }

    componentWillUnmount() {
        if (window.tempPdfWorkers) {
            window.tempPdfWorkers.forEach(wk => {
                wk.destroy()
            })
        }
    }

    render() {

        const { exhibitorDetail, exhibitorID, account } = this.props
        const { contactDetail, listBrochure } = exhibitorDetail
        const { roles } = this.props
        const getRole = formatRoleList(roles)
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


        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800" onClick={() => this.setState({ count: this.state.count + 1 })}>Exhibitor Detail</h1>
                </div>

                {account.roleName !== ROLES.EXHIBITOR ? (
                    <Breadcrumb links={links} />
                ) : <div className="mb-4" />}

                <div className="row">

                    <div className="col-md-12">
                        <Box>

                            {account.roleName !== ROLES.EXHIBITOR ? (
                                 <ExhibitorNav currentTab="info" exhibitorId={exhibitorID} />
                            ) : ''}

                            <div className="pt-3 row">
                                <div className="col-lg-6 mb-2">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title font-weight-bold text-center">Exhibitor Information</h5>
                                            <div className="text-center">
                                                <img className="border list-img mb-3" src={exhibitorDetail.imgageLogo || '../../../static/img/noimage.jpg'} alt="Generic placeholder image" />
                                            </div>
                                            <ul className="list-group list-group-flush  mb-3">
                                                <li className="list-group-item">
                                                    <strong>Exhibitor Name:</strong> {exhibitorDetail.companyName}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Bussiness Type:</strong> {exhibitorDetail.listBusinessType.map(type => type.businessType).join(", ")}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Product Category:</strong> {exhibitorDetail.listProductCategory.map(type => type.name).join(", ")}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Exhibitor Detail:</strong> {exhibitorDetail.companyDetail}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Country:</strong> {exhibitorDetail.countryName}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Booth Number:</strong> {exhibitorDetail.boothNo}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Role:</strong> {getRole[exhibitorDetail.role]}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>User Email:</strong> {exhibitorDetail.userEmail}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>status:</strong> {exhibitorDetail.status}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Contact:</strong>
                                                    <ul>
                                                        <li>
                                                            <strong>Contact Name:</strong> {contactDetail.contactName}
                                                        </li>
                                                        <li>
                                                            <strong>Address:</strong> {contactDetail.address}
                                                        </li>
                                                        <li>
                                                            <strong>Telephone:</strong> {contactDetail.telphone}
                                                        </li>
                                                        <li>
                                                            <strong>E-mail:</strong> {contactDetail.email}
                                                        </li>
                                                        <li>
                                                            <strong>Fax:</strong> {contactDetail.fax}
                                                        </li>
                                                        <li>
                                                            <strong>Mobile:</strong> {contactDetail.mobile}
                                                        </li>
                                                        <li>
                                                            <strong>Website:</strong> {contactDetail.website}
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>


                                <div className="col-lg-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title font-weight-bold text-center">E-Catalog</h5>

                                            <div className="row">

                                                {listBrochure.map((pdf, index) => {
                                                    console.log("pdf url", pdf);


                                                    if (pdf.urlFile && pdf.urlFile != "") {

                                                        return (
                                                            <div key={index} className="col-lg-4 mb-2" key={pdf.urlFile}>
                                                                <PdfThumbnail fileUrl={pdf.urlFile} fileName={pdf.fileName} />
                                                            </div>
                                                        )
                                                    }
                                                })}


                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>

                </div>


            </MainLayout>
        )
    }
}

export default withAuth(ExhibitorInfo, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.EXHIBITOR])
