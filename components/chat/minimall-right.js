import React, { useEffect, useState } from 'react'
import { SRLWrapper } from "simple-react-lightbox";
import SimpleReactLightbox from "simple-react-lightbox";
import api from '../../services/webservice'
import { get, post, put } from '../../services/http'
import { tokenAccount, userAccount, logout } from '../../services/auth'
import { messageType } from '../../util/constants'
import { getImageProfile, isJSON, bytesToSize, iconFile, validateURL } from '../../util/utilities'
import Switch from "react-switch";
import Router from 'next/router';
import Link from 'next/link';

const options = {
    overlayColor: "rgb(0, 0, 0,0.95)",
    showCaption: false,
    buttonsBackgroundColor: "rgba(0, 0, 0, 1)",
    buttonsIconColor: "rgba(255, 255, 255, 1)",
    showThumbnails: false,
    transitionSpeed: 300,
    transitionTimingFunction: "linear",
    showDownloadButton: false,
};

const MinimalRight = props => {

    const [currentStaff, setCurrentStaff] = useState(null)
    const [account, setAccount] = useState({})
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {

        setAccount(userAccount())
        getProfile()
        // if ($(window).width() >= 1500) {
        //     $(".chitchat-main").removeClass("small-sidebar");
        // }

    }, [])


    console.log("account", account)

    function setStatus(status) {

        put(api.SET_STATUS, { statusOnline: status }, tokenAccount())
    }

    function getProfile() {
        post(api.GET_PROFILE, null, tokenAccount()).then(response => {
            setAccount(response.data.result)
            setIsOnline(response.data.result.statusOnline)
        })
    }

    return (
        <aside className="app-sidebar active" >
            <div className="app-list">
                <ul className="app-list-ul custom-scroll">

                    <li>
                        <a className="icon-btn btn-outline-danger btn-sm button-effect" href="staff-list">
                            <img src={getImageProfile(account.imageProfile ? account.imageProfile.fileUrl : '')} alt="" className="rounded-circle" width="40" height="40" style={{ objectFit: 'cover' }}></img>

                        </a>
                        <h5 style={{ marginTop: -4 }}>Profile</h5>
                    </li>
                </ul>
            </div>
            <div className="apps" style={{ position: 'absolute' }}>
                <ul className="apps-ul" style={{ height: '100%' }}>
                    <li id="staff-list" className=" container-right" >
                        <div className="todo-main" >

                            <div className="theme-title">
                                <div className="media">
                                    <div>
                                        <h2>My Profile</h2>
                                        <h4>Exhibitor staff account</h4>
                                    </div>
                                    <div className="media-body media-body text-right"><a className="icon-btn btn-sm btn-outline-light close-apps" href="#"><i className="fas fa-times"></i></a></div>
                                </div>
                            </div>

                            <div className="tab-content custom-scroll">
                                <div className="details">
                                    <div className=" mt-3 text-center align-items-center" style={{ position: 'relative' }}>
                                        <img src={getImageProfile(account.imageProfile ? account.imageProfile.fileUrl : '')} alt="" className="rounded-circle" width="150" height="150" style={{ objectFit: 'cover' }}></img>
                                        <Link href="/profile">
                                            <a href="#" style={{ position: 'absolute', right: 0, bottom: 0 }}><i className="fas fa-pen" /></a>
                                        </Link>
                                    </div>

                                </div>
                                <hr />
                                <div className="status">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <h5>Online</h5>
                                        <Switch onChange={(checked) => {

                                            setIsOnline(checked)
                                            setStatus(checked)

                                        }} checked={isOnline} />

                                    </div>
                                </div>
                                <hr />
                                <div className="d-flex flex-wrap justify-content-between mt-5">
                                    <h5 className="text-left">Name</h5>
                                    <h4 className="text-right">{`${account.userFname} ${account.userLname}`}</h4>
                                </div>
                                <div className="d-flex flex-wrap justify-content-between mt-3">
                                    <h5 className="text-left">Position</h5>
                                    <h4 className="text-right label-value">{`${account.position}`}</h4>
                                </div>
                                <div className="d-flex flex-wrap justify-content-between mt-3">
                                    <h5 className="text-left">Company</h5>
                                    <h4 className="text-right label-value">{`${account.companyName}`}</h4>
                                </div>
                                <div className="d-flex  flex-wrap justify-content-between mt-3">
                                    <h5 className="text-left">Country</h5>
                                    <h4 className="text-right label-value">{`${account.countryName}`}</h4>
                                </div>

                                <div>
                                    <button onClick={() => {
                                        logout().then(() => {
                                            Router.push('/login')
                                        })
                                    }} type="button" className="btn btn-block btn-danger mt-5" style={{ borderRadius: '24px' }}>Logout</button>
                                </div>
                            </div>

                        </div>
                    </li>

                </ul>
            </div>


        </aside>
    )

}

export { MinimalRight }