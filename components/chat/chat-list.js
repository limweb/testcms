import React, { useState, useEffect } from 'react'
import { getImageProfile, isJSON, bytesToSize, iconFile, validateURL, chatDate } from '../../util/utilities'
import api from '../../services/webservice'
import { get, post, put } from '../../services/http'
import { tokenAccount, userAccount } from '../../services/auth'
import { messageType,dateFormat } from '../../util/constants'
import renderHTML from 'react-render-html';
import moment from 'moment'
import ChatScript from '../../components/chat/chat-script'

const ChatList = (props) => {

    const [currentPeer, setCurrentPeer] = useState({})
    const [account, setAccount] = useState({})
    const chatScript = new ChatScript()

    useEffect(() => {
        setAccount(userAccount())
    }, [])


    return (
        <div className="tab-pane fade show active" id="chat" role="tabpanel" aria-labelledby="chat-tab">
            <div className="theme-tab">
                <div className="tab-pane fade show active" id="direct" role="tabpanel" aria-labelledby="direct-tab">
                    <ul className="chat-main">
                        {props.recentChat && props.recentChat.map((peer, index) => {
                           
                            const idItemChat = `${peer.visitorID}-item-chat`
                            return (
                                <li key={index} id={idItemChat} className={`${currentPeer.visitorID === peer.visitorID ? 'active' : ''} item-chat `} onClick={() => {

                                    $('.item-chat').removeClass("active")
                                    
                                    props.onSelectPeerChat(peer, 'chat')
                                    setCurrentPeer(peer)
                                    peer.countUnRead = 0

                                    chatScript.openProfile()
                                    
                                }}>
                                    <div className=" align-items-center row">
                                        <div className={`${peer.statusOnline ? 'online' : 'offline'} mt-3`}>
                                            <img className="bg-img rounded-circle" src={getImageProfile(peer.imageProfile)} alt="Avatar" width="40" height="40" style={{ objectFit: 'cover' }} /></div>
                                        <div className="col item-message-desc">
                                            <h5>{`${peer.firstName} ${peer.lastName}`}</h5>
                                            <div className="mt-2">
                                                {renderRecentMessage(peer)}
                                                <div className="active_phone hide" id={`${peer.visitorID}-calling`}><i className="fas fa-phone-alt"></i></div>
                                            </div>
                                           
                                        </div>
                                        <div className="align-self-start d-flex align-items-end flex-column ">
                                            <h6 className="mb-3">{peer.lastMessages ? chatDate(peer.lastMessages.date) : ' '}</h6>
                                            {peer.countUnRead > 0 ? <div className="badge badge-danger">{peer.countUnRead}</div> : <h6 className="font-success status"> Seen</h6>}


                                        </div>
                                    </div>
                                </li>

                            )

                        })}



                    </ul>
                </div>
            </div>
        </div>

    )

    function renderRecentMessage(peer) {

        console.log("peer.lastMessages", peer.lastMessages)
        if (peer.lastMessages){
            if (peer.lastMessages.type === messageType.TEXT) {
                console.log("TEXT")
                return (
                    <h6 className="detail-recent" id={`${peer.visitorID}-recent-chat`}>{peer.lastMessages.text.length > 20 ? `${peer.lastMessages.text.substring(0, 18)}...` : `${peer.lastMessages.text} ...` }</h6>
                     
                )
            } else if (peer.lastMessages.type === messageType.STICKER) {
                console.log("STICKER")
                return (
                    <div className="detail-recent" style={{height:30,width:30,marginTop:8}} id={`${peer.visitorID}-recent-chat`}>{renderHTML(peer.lastMessages.text || '')}</div>
                )
            } else if (peer.lastMessages.type === messageType.VIDEO_HISTORY) {
                return (
                    <h6 className="detail-recent" id={`${peer.visitorID}-recent-chat`}>{peer.lastMessages.text}</h6>
                )
            } else if (peer.lastMessages.type === messageType.VOICE_HISTORY) {
                return (
                    <h6 className="detail-recent" id={`${peer.visitorID}-recent-chat`}>{peer.lastMessages.text}</h6>
                )
            } else if (peer.lastMessages.type === messageType.VIDEO) {
                return (
                    <h6 className="detail-recent" id={`${peer.exhibitorStaffID}-recent-chat`}>Video</h6>
                )
            } else if (peer.lastMessages.type === messageType.IMAGE) {
                return (
                    <h6 className="detail-recent" id={`${peer.exhibitorStaffID}-recent-chat`}>Image</h6>
                )
            } else if (peer.lastMessages.type === messageType.FILE) {
                return (
                    <h6 className="detail-recent" id={`${peer.exhibitorStaffID}-recent-chat`}>File</h6>
                )
            } else {
                console.log("OTHER")
                return <h6 className="detail-recent" id={`${peer.visitorID}-recent-chat`}>...</h6>
            }
        }else{
            console.log("NULL")
            return <h6 className="detail-recent" id={`${peer.visitorID}-recent-chat`}>...</h6>
        }
       


    }
}

export { ChatList }