import React, { Component } from 'react'
import Link from 'next/link'
import { logout } from '../../services/auth'
import Router from 'next/router'

export class Navbar extends Component {
    render() {

        const { account: { userFname, userLname, imageProfile }, className = '', style = {} } = this.props
        return (
            <nav className={`navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow ${className}`} style={{ ...style }}>

                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="fa fa-bars"></i>
                </button>


                <ul className="navbar-nav ml-auto">

                    <div className="topbar-divider d-none d-sm-block"></div>

                    <li className="nav-item dropdown no-arrow">
                        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{userFname} {userLname}</span>
                            <img className="img-profile rounded-circle" src={imageProfile || '/static/img/ic_default_user.png'} alt="profile image" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                            <Link href="/profile">
                                <a className="dropdown-item" >
                                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>Profile
                                </a>
                            </Link>
                            <div className="bs-dropdown-divider"></div>
                            <button className="dropdown-item" onClick={() => {
                                logout().then(() => {
                                    Router.push('/login')
                                })
                            }}>
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Logout
                            </button>
                        </div>
                    </li>

                </ul>

            </nav>
        )
    }
}

export default Navbar
