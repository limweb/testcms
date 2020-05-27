import React from 'react'
import { SRLWrapper } from "simple-react-lightbox";
import SimpleReactLightbox from "simple-react-lightbox";
import api from '../../services/webservice'
import { get, post, put } from '../../services/http'
import { tokenAccount, userAccount } from '../../services/auth'
import { messageType } from '../../util/constants'
import { getImageProfile, isJSON, bytesToSize, iconFile, validateURL } from '../../util/utilities'

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

const MainContact = props => {

    return (
        <div className="contact-content tabto" style={{ padding: 0 }}>
            <div className="main-contaner custom-scroll active">
                <div style={{ padding: 45 }}>
                    <div className="contact-sub-content" style={{marginBottom:45}}>
                        <div>
                            <div >
                                <div className="user-profile">
                                    <div className="user-content">
                                        <img src={getImageProfile(props.currentContact.imageProfile)} alt="" className="rounded-circle" width="80" height="80" style={{ objectFit: 'cover' }}></img>
                                        
                                        <h3>{`${props.currentContact.firstName} ${props.currentContact.lastName}`}</h3>
                                        <div className="row justify-content-center">
                                            <div className="row user-content">
                                                <ul>
                                                    <li className="action-contact" onClick={() => {

                                                       
                                                        const idChatItem = `#${props.currentContact.visitorID}-item-chat`
                                                        $(idChatItem).addClass("active");
                                                        props.onSelectPeerChat(props.currentContact,'chat')

                                                    }}><i className="fab fa-twitch"> </i>massage</li>
                                                    <li className="action-contact" onClick={() => {

                                                   
                                                        const idChatItem = `#${props.currentContact.visitorID}-item-chat`
                                                        $(idChatItem).addClass("active");
                                                        props.onSelectPeerChat(props.currentContact,'audio')
                                                        props.onVideoCallClick(props.currentContact, "audio")

                                                    }}><i className="fa fa-phone"> </i>voice call</li>
                                                    <li className="action-contact" onClick={() => {

                                                        $('.chitchat-main .tabto').removeClass("active");
                                                        $('.video-content').addClass("active");
                                                        $('.item-chat').removeClass("active");
                                                        const idChatItem = `#${props.currentContact.visitorID}-item-chat`
                                                        $(idChatItem).addClass("active");
                                                        props.onSelectPeerChat(props.currentContact,'video')
                                                        props.onVideoCallClick(props.currentContact,"video")

                                                    }}>  <i className="fa fa-video-camera"> </i>video call</li>
                                                </ul>
                                            </div>
                                        </div>
                                        

                                    </div>
                                </div>

                            </div>

                   
                            <div className="personal-info-group card-container">
                                <h3>contact info</h3>
                                <ul className="basic-info">
                                    <li>
                                        <h5>Company</h5>
                                        <h5 className="details">{`${props.currentContact.companyName}`}</h5>
                                    </li>

                                    <li>
                                        <h5>Address</h5>
                                        <h5 className="details">{props.currentContact.address}</h5>
                                    </li>
                                    <li>
                                        <h5>Telphone</h5>
                                        <h5 className="details">{props.currentContact.telephone}</h5>
                                    </li>
                                    <li>
                                        <h5>Fax</h5>
                                        <h5 className="details">{props.currentContact.fax}</h5>
                                    </li>
                                    <li>
                                        <h5>Mobile</h5>
                                        <h5 className="details">{props.currentContact.mobile}</h5>
                                    </li>
                                    <li>
                                        <h5>Email</h5>
                                        <h5 className="details">{props.currentContact.email}</h5>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            
            </div>

        </div>

    )
}

export { MainContact }