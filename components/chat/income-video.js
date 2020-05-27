import React, { useEffect, useState } from 'react'
import { SocketHostVideo, getImageProfile, getRequestCall, getToknRequestCall, SocketHostChat } from '../../util/utilities'
import SocketClient from 'socket.io-client';
import { tokenAccount, userAccount } from '../../services/auth'
import * as $ from 'jquery';
import { Modal } from 'react-bootstrap';

var delay = null
var isShow = false
var currentPeerId = ""

const IncomeVideo = (props) => {


    const [show, setShow] = useState(false)
    const [peer, setPeer] = useState({})
    const [peerToken, setPeerToken] = useState({})
    const [socket, setSocket] = useState(null)

    useEffect(() => {

        if (userAccount()) {
            const socket = SocketClient(SocketHostVideo(tokenAccount()));
            setSocket(socket)

            socket.on('onRequest', (
                (data) => {

                    console.log("onRequest", isShow)
                    const peerData = getRequestCall(data)
                    if (isShow) {

                        socket.emit('onBusy', peerData.requestID, data)
                    }

                    if (userAccount() && userAccount().accountID && !isShow) {

                        setPeer(peerData)
                        currentPeerId = peerData.requestID

                        setPeerToken(data)
                        isShow = true

                        delay = setTimeout(() => {
                            setShow(true)
                           
                        }, 1000);

                        const audio = document.getElementById("rintone-income");
                        if (audio) {
                            audio.play()
                        }

                    }


                }
            ))


            socket.on('onReject', (data) => {
                console.log("onReject", data)
                setShow(false)
                isShow = false
                currentPeerId = ""

                if ($("#remote-call-hold")) {
                    $("#remote-call-hold").addClass("hide")
                }

                const audio = document.getElementById("rintone-income");
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }

            })

            socket.on('onBusy', (data) => {
                console.log("onBusy", data)
                if (delay) {
                    clearTimeout(delay)
                }
                setShow(false)
                isShow = false
                currentPeerId = ""

                if ($("#remote-call-hold")) {
                    $("#remote-call-hold").addClass("hide")
                }

                const audio = document.getElementById("rintone-income");
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            })

            socket.on('onCancel', (data) => {
                console.log("onCancel", data)

                const peerData = getRequestCall(data)

                if (peerData.requestID === currentPeerId) {
                    setShow(false)
                    isShow = false
                    currentPeerId = ""

                    if ($("#remote-call-hold")) {
                        $("#remote-call-hold").addClass("hide")
                    }

                    const audio = document.getElementById("rintone-income");
                    if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                    }

                }
            

            })

            socket.on('onAccept', (data) => {
                console.log("onAccept", data)
                setShow(false)
                isShow = false
                currentPeerId = ""

                const audio = document.getElementById("rintone-income");
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            })

            socket.on('onJoinRoom', (data) => {
                console.log("onJoinRoom", data)

            })

            socket.emit("joinRoom", userAccount().accountID)

            const socketChat = SocketClient(SocketHostChat(tokenAccount()));
            socketChat.on('onRecieve', (data) => {
                console.log("onRecieve", data)

                const audio = document.getElementById("rintone-notification");
                if (audio) {
                    audio.play()
                }

                if (!window.location.href.includes("/chat")) {
                    const countMessage = this.state.countMessage + 1
                    this.setState({ countMessage })
                }

            })

            socketChat.emit("joinRoom", userAccount().accountID)

        }


    }, [])

    return (

        <div>
            <Modal style={{ backgroundColor: 'transparent', borderWidth: 0 }} show={show} onHide={() => { }} dialogClassName="dialog-container">
                <div className="modal-dialog modal-dialog-centered" role="document" style={{ marginTop: 0 }}>
                    <div className="modal-content" style={{ backgroundColor: 'transparent', borderWidth: 0 }}>
                        <div className="modal-body" style={{ padding: 0 }}>
                            <div className="row align-items-center justify-content-center" style={{ width: 500, height: 654, backgroundColor: 'black' }}>

                                <div className="center-con text-center">
                                    <img src={getImageProfile(peer.imageProfile)} alt="Avatar" className="rounded-circle" width="80" height="80" style={{ objectFit: 'cover', marginBottom: 24 }} />

                                    <div className="title2">{`${peer.userFname} ${peer.userLname}`}</div>
                                    <h6 className="text-white">{peer.companyName}</h6>

                                    <div className="row justify-content-center" style={{ marginTop: 56 }}>
                                        <div>
                                            <a onClick={() => {

                                                const token = getToknRequestCall({ ...peer, expired: new Date().getTime() + 10000 })
                                                socket.emit('onAccept', userAccount().accountID, peer)
                                                socket.emit('onAccept', peer.requestID, peer)
                                                isShow = false
                                                currentPeerId = ""

                                                window.location.href = `/chat?token=${window.btoa(token)}`

                                            }} className="icon-btn btn-success button-effect btn-xl is-animating mr-4" href="#" > <i className={`fas ${peer.action === 'video' ? 'fa-video' : 'fa-phone-alt'}`}></i></a>
                                        </div>
                                        <div>
                                            <a onClick={() => {

                                                setShow(false)
                                                isShow = false
                                                currentPeerId = ""

                                                console.log("Onreject", peer.requestID)
                                                socket.emit('onReject', peer.requestID, peer)
                                                socket.emit('onReject', userAccount().accountID, peer)

                                            }} className="icon-btn btn-danger button-effect btn-xl is-animating cancelcall ml-4" href="#" data-dismiss="modal" data-target="#audiocall"> <i className="fas fa-phone-slash"></i></a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </Modal>
            <audio id="rintone-income" loop={true} >
                <source src="/static/audio/ringtone.wav" type="audio/wav"></source>
            </audio>

            <audio id="rintone-notification"  >
                <source src="/static/audio/notification.wav" type="audio/wav"></source>
            </audio>
        </div>
    )
}

export { IncomeVideo }