import React,{useEffect,useState} from 'react'
import api from '../../services/webservice'
import { get, post, put } from '../../services/http'
import { tokenAccount, userAccount } from '../../services/auth'
import { messageType } from '../../util/constants'
import {getImageProfile} from '../../util/utilities'

const ContactList = (props) =>{


    const [contactList,setContactList] = useState([])
    const [contactSelect, setContactSelect] = useState({})


    useEffect(() =>{
        props.getContactList(getContactList)
        getContactList()

    },[])

    function getContactList(keyword){

        const parameter = {
            keyword:keyword||""
        }

        post(api.GET_CONTACT, parameter,tokenAccount()).then(response =>{
            setContactList(response.data.result)
        })
    }

    console.log("contactList",contactList)

    return(
        <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
            <ul className="contact-log-main">

                {contactList.map((contact,index) =>{

                    return(
                        <li key={index} className={`${contactSelect.visitorID === contact.visitorID ? 'active' : ''}`} style={{ paddingBottom: 16 }} onClick={() =>{
                            setContactSelect(contact)
                            props.onSelectContact(contact)
                            $('.chitchat-main .tabto').removeClass("active");
                            $('.contact-content').addClass("active");
                        }}>
                            <div className="contact-box">

                                <div className="profile"><img className="bg-img rounded-circle" src={getImageProfile(contact.imageProfile)} alt="Avatar" width="60" height="60" style={{ objectFit: 'cover' }} /></div>
                                <div className="details" >
                                    <h5 >{`${contact.firstName} ${contact.lastName}`}</h5>
                                    <h6 >{`${contact.companyName}`}</h6>
                                </div>
                               
                            </div>
                        </li>

                    )
                })}
                
            </ul>
        </div>

    )
}

export {ContactList}