import React,{useEffect,useState} from 'react'
import { SRLWrapper } from "simple-react-lightbox";
import SimpleReactLightbox from "simple-react-lightbox";
import {getImageProfile} from '../../util/utilities'

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

const ContactProfile = props =>{

    const { currentPeer} = props
    const [firstName,setFirstName] = useState(null)
    
    console.log("currentPeer", currentPeer)

    useEffect(() => {
        console.log('currentPeer updated');

        setFirstName(null)
        setTimeout(() => {
            setFirstName(currentPeer.firstName)
        }, 50);

    }, [props.currentPeer])


    return(
        <aside className="chitchat-right-sidebar" id="slide-menu">
            <div className="custom-scroll right-sidebar">
                <div className="contact-profile">
                    <div className="theme-title">
                        <div className="media">
                            <div>
                                <h2>Profile</h2>
                                <h4>Personal Information</h4>
                            </div>
                            <div className="media-body text-right">   <a className="icon-btn btn-outline-light btn-sm close-profile ml-3" href="#"> <i className="fas fa-times"></i></a></div>
                        </div>
                    </div>
                   
                   <div className="details">
                        <div className=" mt-3 text-center align-items-center">
                            
                            <SimpleReactLightbox >
                                <SRLWrapper options={options}>
                                    {(firstName && firstName != "") ? <img src={getImageProfile(currentPeer.imageProfile)} alt={currentPeer.firstName} className="rounded-circle" width="150" height="150" style={{ objectFit: 'cover' }}></img> : <div style={{width:150,height:150}}/>}
                                   
                                </SRLWrapper>
                            </SimpleReactLightbox>
                            
                          


                        </div>
                        
                   </div>
                </div>


                <div className="status">
                    <div>
                        <div className="row mt-5">
                            <h5 className="text-left">Name</h5>
                            <div className="col" />
                            <h4 className="text-right label-value">{`${currentPeer.firstName} ${currentPeer.lastName}`}</h4>
                        </div>
                        <div className="row mt-3">
                            <h5 className="text-left">Position</h5>
                            <div className="col" />
                            <h4 className="text-right label-value">{`${currentPeer.position}`}</h4>
                        </div>
                        <div className="row mt-3">
                            <h5 className="text-left">Company</h5>
                            <div className="col" />
                            <h4 className="text-right label-value">{`${currentPeer.companyName}`}</h4>
                        </div>
                        <div className="row mt-3">
                            <h5 className="text-left">Country</h5>
                            <div className="col" />
                            <h4 className="text-right label-value">{`${currentPeer.countryName}`}</h4>
                        </div>

                    </div>
                </div>

            </div>
        </aside>
    )
}

export {ContactProfile}