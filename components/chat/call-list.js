import React, { useEffect, useState } from 'react'
import api from '../../services/webservice'
import { get, post, put } from '../../services/http'
import { tokenAccount, userAccount } from '../../services/auth'
import { messageType, stateCall } from '../../util/constants'
import { SocketHostVideo, getRequestCall, chatDate, getImageProfile } from '../../util/utilities'

const CallList = (props) => {

    const [callList, setCallist] = useState([])
    const [currentPeer, setCurrentPeer] = useState({})

    useEffect(() => {
        props.getCallList(getCallList)
        getCallList()

    }, [])

    function getCallList(keyword) {

        const parameter = {
            keyword: keyword || ""
        }

        post(api.CALL_LIST, parameter, tokenAccount()).then(response => {
            setCallist(response.data.result)
        })
    }

    return (
        <div className="tab-pane fade" id="call" role="tabpanel" aria-labelledby="call-tab">
            <div className="theme-tab tab-icon">

                <div className="tab-content " id="contactTabContent">
                    <div className="tab-pane fade show active" id="con1" role="tabpanel" aria-labelledby="con1-tab">
                        <ul className="call-log-main">

                            {callList.map((call, index) => {

                                return (
                                    <li key={call.contactID} className={`${call.visitorID === currentPeer.visitorID ? 'active' : ''}`} onClick={() => {
                                        setCurrentPeer(call)
                                        props.onSelectPeerChat(call, 'chat')
                                    }}>
                                        <div className="call-box">
                                            <div className={`profile ${call.statusOnline ? 'online' : 'offline'} mt-3`}><img className="bg-img rounded-circle" src={getImageProfile(call.imageProfile)} alt="Avatar" width="40" height="40" style={{ objectFit: 'cover' }} /></div>
                                            <div className="details">
                                                <h5>{`${call.firstName} ${call.lastName}`}</h5>
                                                <h6> <i data-feather="arrow-down-left" />{chatDate(call.lastMessages.date)}</h6>
                                            </div>
                                            <div className="call-status">
                                                <div className="icon-btn btn-outline-success button-effect btn-sm"><i className={`fas ${call.lastMessages.type === messageType.VIDEO_HISTORY ? 'fa-video' : 'fa-phone-alt'}`}></i></div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}


                        </ul>
                    </div>

                </div>
            </div>
        </div>

    )
}

export { CallList } 