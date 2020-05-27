import React, { Component } from 'react'
import Link from 'next/link'
import { withRouter } from 'next/router';
import { ProtectedLink } from '../ProtectedLink';
import { ROLES } from '../../util/constants';
import cookie from "js-cookie"
import { getRootRoute } from '../../services/auth';


export class Sidebar extends Component {

    state = {
        toggled: cookie.get('toggle') === 'true' ? true : false
    }

    toggleSidebar() {
        const bool = !this.state.toggled
        this.setState({ toggled: bool }, () => {
            cookie.set('toggle', bool, { expires: 1 })
        })
    }

    isActive(firstPath) {
        const realPath = this.props.router.asPath
        const splitPath = realPath.split('/')
        const currentFirstPath = "/" + splitPath[1]
        return firstPath === currentFirstPath ? 'active' : ''
    }

    isActiveForExhibitor(firstPath) {
        const realPath = this.props.router.asPath
        const splitPath = realPath.split('/')
        const currentFirstPath = "/" + splitPath[1] + "/" + splitPath[2] + "/" + splitPath[3]
        return firstPath === currentFirstPath ? 'active' : ''
    }

    render() {

        const { account } = this.props
        const { roleName, accountID } = account
        const rootPath = getRootRoute(account)

        return (
            <ul className={`navbar-nav bg-gradient-danger sidebar sidebar-dark accordion ${this.state.toggled ? 'toggled' : ''}`} id="accordionSidebar">

                <div style={{ position: 'relative' }}>
                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href={rootPath}>
                        <div className="sidebar-brand-text mx-3">Virtual Event</div>
                    </a>
                    <div className="d-none d-md-inline mt-3 text-light" style={{ position: 'absolute', right: '-50px', top: '0px', zIndex: 100 }}>
                        <button onClick={this.toggleSidebar.bind(this)} className="rounded-circle border-0 bg-danger text-center" id="sidebarToggle"></button>
                    </div>
                </div>

                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.ORGANIZER]} userRole={roleName}>
                    <hr className="sidebar-divider my-0" />
                    <li className={`nav-item ${this.isActive('/dashboard')}`}>
                        <Link href="/dashboard">
                            <a className="nav-link">
                                <i className="fas fa-fw fa-tachometer-alt"></i>
                                <span>Dashboard</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink>

                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF]} userRole={roleName}>
                    <hr className="sidebar-divider my-0" />
                    <li className={`nav-item ${this.isActive('/war-room')}`}>
                        <Link href="/war-room">
                            <a className="nav-link">
                                <i className="fas fa-satellite-dish"></i>
                                <span>War room</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink>

                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF]} userRole={roleName}>
                    <hr className="sidebar-divider my-0" />
                    <li className={`nav-item ${this.isActive('/announcement')}`}>
                        <Link href="/announcement">
                            <a className="nav-link">
                                <i className="fas fa-bullhorn"></i>
                                <span>Announcement</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink>

                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.ORGANIZER]} userRole={roleName}>
                    <hr className="sidebar-divider my-0" />
                    <li className={`nav-item ${this.isActive('/users')}`}>
                        <Link href="/users">
                            <a className="nav-link">
                                <i className="fas fa-users-cog"></i>
                                <span>User & Role</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink>

                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF]} userRole={roleName}>
                    <>
                        <hr className="sidebar-divider" />
                        <div className="sidebar-heading">Organization</div>
                    </>
                </ProtectedLink>


                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF]} userRole={roleName}>
                    <li className={`nav-item ${this.isActive('/fair-information')}`}>
                        <Link href="/fair-information">
                            <a className="nav-link collapsed"  >
                                <i className="fas fa-info-circle"></i>
                                <span>Fair Information</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink>
                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF]} userRole={roleName}>
                    <li className={`nav-item ${this.isActive('/campaign')}`}>
                        <Link href="/campaign">
                            <a className="nav-link collapsed"  >
                                <i className="fas fa-star"></i>
                                <span>Campaign</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink>
                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF]} userRole={roleName}>
                    <li className={`nav-item ${this.isActive('/floor-plan')}`}>
                        <Link href="/floor-plan">
                            <a className="nav-link collapsed"  >
                                <i className="fas fa-map-marked-alt"></i>
                                <span>Floor Plan</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink>
                {/* <ProtectedLink acceptRoles userRole={roleName}>
                    <li className={`nav-item ${this.isActive('/live')}`}>
                        <Link href="/live">
                            <a className="nav-link collapsed"  >
                                <i className="fas fa-headset"></i>
                                <span>Live</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink>
                <ProtectedLink acceptRoles userRole={roleName}>
                    <li className={`nav-item ${this.isActive('/speaker')}`}>
                        <Link href="/speaker">
                            <a className="nav-link collapsed"  >
                                <i className="fas fa-users"></i>
                                <span>Speaker</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink> */}


                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF]} userRole={roleName}>
                    <>
                        <hr className="sidebar-divider" />
                        <div className="sidebar-heading">Exhibition</div>
                    </>
                </ProtectedLink>

                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF]} userRole={roleName}>
                    <li className={`nav-item ${this.isActive('/exhibitor')}`}>
                        <Link href="/exhibitor">
                            <a className="nav-link collapsed" >
                                <i className="fas fa-store"></i>
                                <span>Exhibitor</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink>


                <ProtectedLink acceptRoles={[ROLES.SUPER_ADMIN, ROLES.EXHIBITOR_STAFF]} userRole={roleName}>
                    <hr className="sidebar-divider my-0" />
                    <li className={`nav-item ${this.isActive('/chat')}`}>
                        <a className="nav-link collapsed" href="/chat">
                            <i className="fas fa-comments"></i>
                            <span>Chat</span>
                        </a>
                    </li>
                </ProtectedLink>

                {/* For Exhibitor */}
                <ProtectedLink acceptRoles={[ROLES.EXHIBITOR]} userRole={roleName}>
                    <hr className="sidebar-divider my-0" />
                    <li className={`nav-item ${this.isActiveForExhibitor(`/exhibitor/${accountID}`)}`}>
                        <Link href="/exhibitor/[id]" as={`/exhibitor/${accountID}`}>
                            <a className="nav-link collapsed">
                                <i className="fas fa-info-circle"></i>
                                <span>Information</span>
                            </a>
                        </Link>
                    </li>
                    <hr className="sidebar-divider my-0" />
                    <li className={`nav-item ${this.isActiveForExhibitor(`/exhibitor/${accountID}/virtual-booth`)}`}>
                        <Link href="/exhibitor/[id]/virtual-booth" as={`/exhibitor/${accountID}/virtual-booth`}>
                            <a className="nav-link collapsed">
                                <i className="fas fa-vr-cardboard"></i>
                                <span>Virtual Booth</span>
                            </a>
                        </Link>
                    </li>
                    <hr className="sidebar-divider my-0" />
                    <li className={`nav-item ${this.isActiveForExhibitor(`/exhibitor/${accountID}/product`)}`}>
                        <Link href="/exhibitor/[id]/product" as={`/exhibitor/${accountID}/product`}>
                            <a className="nav-link collapsed">
                                <i className="fas fa-box"></i>
                                <span>Product</span>
                            </a>
                        </Link>
                    </li>
                    <hr className="sidebar-divider my-0" />
                    <li className={`nav-item ${this.isActiveForExhibitor(`/exhibitor/${accountID}/account`)}`}>
                        <Link href="/exhibitor/[id]/account" as={`/exhibitor/${accountID}/account`}>
                            <a className="nav-link collapsed">
                                <i className="fas fa-user-friends"></i>
                                <span>Staff</span>
                            </a>
                        </Link>
                    </li>
                    <hr className="sidebar-divider my-0" />
                    <li className={`nav-item ${this.isActiveForExhibitor(`/exhibitor/${accountID}/dashboard`)}`}>
                        <Link href="/exhibitor/[id]/dashboard" as={`/exhibitor/${accountID}/dashboard`}>
                            <a className="nav-link collapsed">
                                <i className="fas fa-chart-bar"></i>
                                <span>Dashboard</span>
                            </a>
                        </Link>
                    </li>
                </ProtectedLink>

            </ul >
        )
    }
}

export default withRouter(Sidebar)
