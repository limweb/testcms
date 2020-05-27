import React from 'react'
import RtcClient from '../../lib/agora/rtc-client'
import { getDevices, resolutions } from '../../lib/agora/rtc-common'
import { getImageProfile, isJSON, bytesToSize, iconFile, validateURL, isSafari } from '../../util/utilities'
import api from '../../services/webservice'
import { get, post, put } from '../../services/http'
import { tokenAccount, userAccount } from '../../services/auth'
import { messageType, stateCall } from '../../util/constants'
import moment from 'moment'
import { SocketHostVideo, getRequestCall } from '../../util/utilities'
import SocketClient from 'socket.io-client';
import { withToastManager } from 'react-toast-notifications';

class CallVideo extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isFullScreen: false,
            isMuteVideo: false,
            isMuteVoice: false,
            isShareScreen: false,
            isLocalShareScreen: false,
            isRequestCall: false,
            isCalling: false,
            stringTime: "",
            callTime:0,
            room: "",
            type: "",
            localStreams: [],
            peerStreamID: "",
            peerMuteAudio: false,
            peerMuteVideo: false,
            peerScreenStreamID: "",
            currentPeer: {},
            action:""
        }



        this.rtc = new RtcClient([])
        this.rtcInit()
        this.timeOutCall = null

        this.socketVideo = SocketClient(SocketHostVideo(tokenAccount()));


        if (this.props.onRef) {
            this.props.onRef(this)
        }

    }


    initSocket() {



        this.socketVideo.on('onRequest', (data) => {
            console.log("onRequest", data)

            if (this.state.isCalling || this.state.isRequestCall) {
                const peer = getRequestCall(data)
                this.socketVideo.emit('onBusy', peer.requestID, data)
                this.socketVideo.emit('onBusy', userAccount().accountID, data)
            }

        })


        this.socketVideo.on('onBusy', (data) => {
           
            const peer = getRequestCall(data)
            console.log("onBusy", peer)
            console.log("accountID", userAccount().accountID)

            if (this.state.action === 'out' && userAccount().accountID === peer.accountID) {
                const content = (
                    <div>
                        <strong>Failure</strong>
                        <div>Your contact is busy</div>
                    </div>
                );
                this.props.toastManager.add(content, {
                    placement: 'top-right',
                    appearance: 'error',
                    autoDismiss: true,
                }, () => { });

                this.endCall()
            }

        })

        this.socketVideo.on('onReject', (data) => {
            console.log("onReject calling", data)

            if (this.state.action === 'out') {
                const content = (
                    <div>
                        <strong>Failure</strong>
                        <div>Your contact is busy</div>
                    </div>
                );
                this.props.toastManager.add(content, {
                    placement: 'top-right',
                    appearance: 'error',
                    autoDismiss: true,
                }, () => { });
            }
           


            this.endCall()
        })

        this.socketVideo.on('onCancel', (data) => {
            console.log("onCancel", data)


        })

        this.socketVideo.on('onAccept', (data) => {
            console.log("onAccept", data)

        })

        this.socketVideo.on('onShareScreen', (data) => {
            console.log("onShareScreen", data)

            this.setState({ peerScreenStreamID: data })

        })

        this.socketVideo.on('onStopShareScreen', (data) => {
            console.log("onStopShareScreen", data)
            this.setState({ isShareScreen: false })
        })

        this.socketVideo.on('onJoinRoom', (data) => {
            console.log("onJoinRoom", data)

        })

        this.socketVideo.emit("joinRoom", userAccount().accountID)
    }

    clearState() {

        this.setState({
            isFullScreen: false,
            isMuteVideo: false,
            isMuteVoice: false,
            isShareScreen: false,
            isLocalShareScreen: false,
            isRequestCall: false,
            isCalling: false,
            stringTime: "",
            callTime:0,
            room: "",
            type: "",
            localStreams: [],
            peerStreamID: "",
            peerMuteAudio: false,
            peerMuteVideo: false,
            peerScreenStreamID: "",
            currentPeer: {},
            action:""
        })

        if (this.intervalCall) {
            clearInterval(this.intervalCall)
        }

        this.intervalCall = null
        this.localStream = null
        this.ownStream = null
        this.shareScreenStream = null
        this.rtcScreen = null
        this.rtc.localStreams = []

        $("#remote-call-hold").addClass("hide")
        $("#remote-call-container").append($("#remote_video_call"));

        const audio = document.getElementById("rintone-income");
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

    }

    defaultChat() {
        $('.chitchat-main .tabto').removeClass("active");
        $('.chat-content').addClass("active");
    }

    endCall() {

        console.log("endCall", this.state.action)
        this.rtc.unpublish()
        this.rtc.leave()

        if (this.state.isCalling || this.state.isRequestCall) {
            this.defaultChat()
        }

        console.log("TYPE", this.state.type)
        if (this.state.action === 'out') {



            if (this.state.isCalling) {


                this.props.onEnterMessage({
                    text: `Call end ${this.state.stringTime}`,
                    callTime:this.state.callTime,
                    type: this.state.type === 'video' ? messageType.VIDEO_HISTORY : messageType.VOICE_HISTORY,
                    date: moment(new Date()).format("DD-MM-YYYY HH:mm:ss")
                },this.state.currentPeer.visitorID)


            } else if (this.state.isRequestCall) {

                this.props.onEnterMessage({
                    text: `Missed`,
                    type: this.state.type === 'video' ? messageType.VIDEO_HISTORY : messageType.VOICE_HISTORY,
                    date: moment(new Date()).format("DD-MM-YYYY HH:mm:ss")
                }, this.state.currentPeer.visitorID)

            }

        }



        if (this.state.isRequestCall) {
            this.props.onVideoCancelCall(this.state.currentPeer, this.state.room, this.state.type)
        }




        if (this.rtcScreen) {
            this.rtcScreen.unpublish()
            this.rtcScreen.leave()
            this.rtcScreen = null
        }

        this.props.onEndCall(this.state.currentPeer)

        this.clearState()




    }

    componentDidMount() {
        this.countTime()
        this.initSocket()
    }

    componentWillUnmount() {

        if (this.intervalCall) {
            clearInterval(this.intervalCall)
        }
    }

    rtcInit() {

        this.rtc.on('error', (error) => {

            this.endCall()

        })

        this.rtc.on('peer-leave', function (evt) {
            if (evt.stream && !this.state.localStreams.includes(evt.stream.getId())) {

                console.log("peer-leave", this.state.peerScreenStreamID)
                console.log("peer-leave", evt.stream.getId())

                if (this.state.peerScreenStreamID === evt.stream.getId()) {
                    this.setState({ peerScreenStreamID: '' })
                } else {
                    this.endCall()
                }

            }


        }.bind(this))

        this.rtc.on("mute-audio", function (evt) {
            var uid = evt.uid;
            if (uid === this.state.peerStreamID) {
                this.setState({ peerMuteAudio: true })
            }
        }.bind(this));

        this.rtc.on("unmute-audio", function (evt) {
            var uid = evt.uid;
            if (uid === this.state.peerStreamID) {
                this.setState({ peerMuteAudio: false })
            }

        }.bind(this));

        this.rtc.on("mute-video", function (evt) {
            var uid = evt.uid;
            if (uid === this.state.peerStreamID) {
                this.setState({ peerMuteVideo: true })
            }

        }.bind(this));

        this.rtc.on("unmute-video", function (evt) {
            var uid = evt.uid;
            if (uid === this.state.peerStreamID) {
                this.setState({ peerMuteVideo: false })
            }

        }.bind(this));

        this.rtc.on('stream-published', (evt) => {
            console.log("stream-published")
        })

        this.rtc.on('on-init-client', (client) => {

        })

        this.rtc.on("stopScreenSharing", (evt) => {

        })

        this.rtc.on('on-init-local-stream', (localStream) => {

            console.log("on-init-local-stream")
            const localStreams = this.state.localStreams
            localStreams.push(localStream.getId())
            this.setState({ localStreams })

            this.ownStream = localStream
        })




        this.rtc.on('stream-subscribed', (evt) => {

            console.log("id stream", evt.stream)
            // console.log("local stream", this.shareScreenStream.getId())
            const remoteStream = evt.stream;
            const id = remoteStream.getId();

            if (this.timeOutCall) {
                clearTimeout(this.timeOutCall)
            }

            if (this.state.peerScreenStreamID != id) {

                this.props.onPeerAccept(this.state.currentPeer, this.state.type)

                const audio = document.getElementById("rintone-income");
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
                
                this.setState({
                    isRequestCall: false,
                    isCalling: true,
                    peerStreamID: id
                })
                this.countTime()
                remoteStream.play("remote_video_call", { fit: "cover" }, (err) => {

                    if (err) {
                        console.log("error",err)
                        if (err.status == 'paused') {

                        } else {
                            console.error(err);
                        }
                    }
                });

               

            } else {

                remoteStream.play("remote_share_screen_call", { fit: "contain" }, (err) => {

                    if (err) {
                        if (err.status == 'paused') {
                        } else {
                            console.error(err);
                        }
                    }
                });

                this.setState({ isShareScreen: true })
            }



        })

        this.rtc.on('stream-removed', (evt) => {

            const remoteStream = evt.stream;
            const id = remoteStream.getId();
            // Toast.info("stream-removed uid: " + id);
            remoteStream.stop();

            if (evt.stream && !this.state.localStreams.includes(evt.stream.getId())) {
                if (this.state.peerScreenStreamID === evt.stream.getId()) {
                    this.setState({ peerScreenStreamID: '' })
                } else {
                    this.endCall()
                }
            }


        })

        this.rtc.on('onLocalStreamInit', (localStream) => {

            this.localStream = localStream
            localStream.play("local_out_call", { fit: "cover" }, (err) => {
                // if (err) {
                //     if (err.status == 'pasued') {
                //         $("#video_autoplay_local").removeClass("hide")
                //     } else {
                //         console.error(err);
                //     }
                // }
            });

        })

        this.rtc.on('onLocalLeave', (localStream, remoteStreams) => {

        })



    }


    screenShare(room) {

        this.rtcScreen = new RtcClient(this.state.localStreams)
        this.rtcScreen.on('onLocalStreamInit', function (localStream) {
            const localStreams = this.state.localStreams
            localStreams.push(localStream.getId())

            this.socketVideo.emit('onShareScreen', this.state.currentPeer.visitorID, localStream.getId())

            this.setState({ localStreams })

            this.rtc.localStreams = localStreams
            this.rtcScreen.localStreams = localStreams

            console.log("onLocalStreamInit Share", this.state.currentPeer)
            this.shareScreenStream = localStream
            localStream.play("remote_share_screen_call", { fit: "contain" }, (err) => {

            });

        }.bind(this))


        const account = userAccount()

        if (room || room === "") {

            this.rtcScreen.join({
                channel: room,
                username: account.accountID,
                uid: 0,
                mode: 'rtc',
                codec: 'vp8',
                role: 'screen',

            }).then(() => {
                this.rtcScreen.publish()
                this.setState({
                    isShareScreen: true,
                    isLocalShareScreen: true
                })

            })
        } else {
            const content = (
                <div>
                    <strong>Failure</strong>
                    <div>
                        Unable to share
                </div>
                </div>
            );
            this.props.toastManager.add(content, {
                placement: 'top-right',
                appearance: 'error',
                autoDismiss: true,
            }, () => { });


            this.endScreenShare()
        }


    }

    endScreenShare() {

        this.socketVideo.emit('onStopShareScreen', this.state.currentPeer.visitorID, this.shareScreenStream.getId())
        this.setState({
            isShareScreen: false,
            isLocalShareScreen: false
        })
        if (this.rtcScreen) {
            this.rtcScreen.unpublish()
            this.rtcScreen.leave()
            this.rtcScreen = null
        }
    }

    getStateCall() {

        if (this.state.isCalling) {
            return stateCall.CALLING
        } else if (this.state.isRequestCall) {

            return stateCall.REQUEST_CALL
        }

        return stateCall.IDLE
    }

    getPeerAccountID() {

        return this.state.peerAccountID
    }

    async joinRoom(room, type, currentPeer, action) {

        this.clearState()
        this.setState({
            isRequestCall: true,
            room: room,
            type: type,
            peerAccountID: currentPeer.visitorID,
            currentPeer: currentPeer,
            action: action
        })

        const account = userAccount()

        return new Promise((resolve, reject) => {
            if (room || room === "") {

                this.rtc.join({
                    channel: room,
                    username: account.accountID,
                    uid: 0,
                    mode: 'rtc',
                    codec: 'h264',
                    role: type,

                }).then(() => {

                    if (action === 'out') {
                        this.timeOutCall = setTimeout(() => {
                            console.log("setTimeout")
                            this.endCall()

                        }, 1000 * 60);

                        const audio = document.getElementById("rintone-income");
                        if (audio) {
                            audio.play()
                        }

                    }

                    this.rtc.publish()
                    this.props.onStartCall(this.state.currentPeer)
                    resolve()
                }).catch(error => {

                    this.endCall()

                    const content = (
                        <div>
                            <strong>Failure</strong>
                            <div>Unable to call</div>
                        </div>
                    );
                    this.props.toastManager.add(content, {
                        placement: 'top-right',
                        appearance: 'error',
                        autoDismiss: true,
                    }, () => { });

                    reject()
                })

            } else {

                const content = (
                    <div>
                        <strong>Failure</strong>
                        <div>
                            Unable to call
                </div>
                    </div>
                );
                this.props.toastManager.add(content, {
                    placement: 'top-right',
                    appearance: 'error',
                    autoDismiss: true,
                }, () => { });


                this.endCall()
                this.defaultChat()
                reject()
            }


        })

    }

    leaveRoom() {
        this.rtc.leave()
    }

    countTime() {


        const start = new Date().getTime();

        this.intervalCall = setInterval(() => {

            const now = new Date().getTime()
            const distance = now - start;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const callTime = this.state.callTime + 1000

            this.setState({
                callTime,
                stringTime: ((hours < 10) ? `0${hours}` : hours) + ":" + ((minutes < 10) ? `0${minutes}` : minutes) + ":" + ((seconds < 10) ? `0${seconds}` : seconds)
            })

        }, 1000);
    }

    render() {

        const { currentPeer } = this.state
        const account = userAccount()

        return (
            <div className="video-content tabto  " style={{ padding: 0 }}>
                <div className="container-video-chat">
                    <div id="video-call-container" className="videocall call-modal" style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                        <div className={`${this.state.isShareScreen ? 'container-video-full' : 'video-hide'}`} id="remote_share_screen_call" />
                       <div id="remote-call-container">
                            <div className={`${this.state.isShareScreen ? 'container-video-small' : 'container-video-full'}`} id="remote_video_call" />
                       </div>
     
                        <div id="remote-call-current">
                            <div className={`local-stream ${this.state.isShareScreen ? 'video-hide' : (this.state.isCalling ? 'container-video-small' : 'container-video-full')}  `} id="local_out_call">
                                {this.state.isMuteVideo && <img src={getImageProfile(account.imageProfile)} alt="" className="rounded-circle img-profile-mute-video" width="60" height="60" style={{ objectFit: 'cover', marginLeft: -30, marginTop: -30 }}></img>}

                            </div>
                        </div>

                        <div className="media videocall-details">

                            <div className="media-body">
                                <h5 className="text-white">{`${currentPeer.firstName} ${currentPeer.lastName}`}</h5>
                                <h6 className="text-white">{currentPeer.companyName} </h6>
                            </div>

                            <div id="basicUsage" className="text-white">{this.state.stringTime}</div>

                            <div className="zoomcontent">
                                <a className="text-dark" href="#!" onClick={() => {

                                    this.requestOrExitFullScreen()

                                }} data-tippy-content="Zoom Screen">
                                    <img src="../../static/chat/images/logo/maximize.svg" alt="zoom screen" />
                                </a>
                            </div>
                        </div>

                        {!this.state.isShareScreen && (this.state.isCalling && this.state.type === 'audio') && <div className="profile-request-calling text-center row justify-content-center">
                            <img src={getImageProfile(currentPeer.imageProfile)} alt="" className="rounded-circle" width="120" height="120" style={{ objectFit: 'cover' }}></img>
                            {this.state.peerMuteAudio && <div className="container-icon-peer icon-mute-audio" style={{ margin: 0 }}>
                                <i className="fas fa-microphone-slash"></i>
                            </div>}
                        </div>}

                        {this.state.type === 'video' && <div className="profile-request-calling text-center row justify-content-center">
                            {this.state.peerMuteAudio && <div className="container-icon-peer">
                                <i className="fas fa-microphone-slash"></i>
                            </div>}
                            {this.state.peerMuteVideo && <div className="container-icon-peer">
                                <i className="fas fa-video-slash"></i>
                            </div>}

                        </div>}

                       <div>
                            <div className="profile-request-calling text-center hide" id="request-profile" style={{ marginTop: -50 }}>
                                <img src={getImageProfile(currentPeer.imageProfile)} alt="" className="rounded-circle" width="50" height="50" style={{ objectFit: 'cover' }}></img>
                                {this.state.isRequestCall && <p className="text-white mt-3">{`Calling ${currentPeer.firstName} ${currentPeer.lastName} ....`}</p>}
                                {this.state.isCalling && <p className="text-white mt-3">{this.state.stringTime}</p>}
                            </div>
                       </div>

                        {this.state.isRequestCall && <div className="profile-request-calling text-center" >
                            <img src={getImageProfile(currentPeer.imageProfile)} alt="" className="rounded-circle" width="80" height="80" style={{ objectFit: 'cover' }}></img>
                            <p className="text-white mt-3 mb-5">{`Calling ${currentPeer.firstName} ${currentPeer.lastName} ....`}</p>
                        </div>}





                        {this.state.isRequestCall && <div className="center-con text-center">

                            <ul>

                                <li><a onClick={() => {


                                    this.endCall()

                                }} className="icon-btn btn-danger button-effect btn-xl is-animating" href="#"  data-tippy-content="Hangup"> <i className="fas fa-phone-slash"></i></a></li>

                            </ul>
                        </div>}



                        {this.state.isCalling && <div className="center-con text-center">
                            <ul>
                                {this.state.type === 'video' && <li><a
                                    onClick={() => {

                                        if (this.state.isMuteVideo) {
                                            this.ownStream.unmuteVideo()
                                        } else {
                                            this.ownStream.muteVideo()
                                        }

                                        this.setState({ isMuteVideo: !this.state.isMuteVideo })
                                    }}
                                    className="icon-btn btn-light button-effect pause" href="#" data-tippy-content="Hold"><i className={`fas ${this.state.isMuteVideo ? 'fa-video-slash' : 'fa-video'}`} /></a></li>
                                }

                                <li><a onClick={() => {

                                    this.endCall()

                                }} className="icon-btn btn-danger button-effect btn-xl" href="#"  data-tippy-content="Hangup"> <i className="fas fa-phone-slash"></i></a></li>
                                <li><a
                                    onClick={() => {
                                        if (this.state.isMuteVoice) {
                                            this.ownStream.unmuteAudio()
                                        } else {
                                            this.ownStream.muteAudio()
                                        }
                                        this.setState({ isMuteVoice: !this.state.isMuteVoice })
                                    }}
                                    className="icon-btn btn-light button-effect mic" href="#" data-tippy-content="Mute"><i className={`fas ${this.state.isMuteVoice ? 'fa-microphone-slash' : 'fa-microphone'}`} /></a></li>

                                {(!this.state.isShareScreen && !isSafari()) && <li style={{ position: 'absolute', right: 36 }}><a
                                    onClick={() => {

                                        this.screenShare(this.state.room)
                                    }}
                                    className="icon-btn btn-light button-effect mic" href="#" data-tippy-content="Mute"><i className={`fas fas fa-desktop`} /></a></li>}

                                {this.state.isLocalShareScreen && <li style={{ position: 'absolute', right: 36 }}>
                                    <button onClick={() => {
                                        this.endScreenShare()
                                    }} type="button" className="btn btn-danger" >STOP SHARING</button>
                                </li>}

                            </ul>
                        </div>}

                    </div>
                </div>

            </div>

        )
    }

    requestOrExitFullScreen() {

        const elem = document.getElementById("video-call-container");

        if (this.state.isFullScreen) {

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }

        } else {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        }

        this.setState({ isFullScreen: !this.state.isFullScreen })

    }
}


const CallingVideo = withToastManager(CallVideo)
export { CallingVideo }