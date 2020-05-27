import React from 'react'
import RtmClient from '../../lib/agora/rtm-client'
import { ChatList, CallList, ContactList, HeaderRecent, MainChat, IncomeVoice, MainCall, MainContact, ContactProfile, MinimalRight, CallingVoice, CallingVideo, ExhibitorDetail } from '../../components/chat'

import { userAccount, logout, tokenAccount, withAuth } from '../../services/auth'
import ChatScript from '../../components/chat/chat-script'
import { get, post, put } from '../../services/http'
import api from '../../services/webservice'
import { messageType, stateCall, ALL_ROLES, ROLES } from '../../util/constants'
import moment from 'moment'
import Router from 'next/router'
import { SocketHostVideo, getRequestCall, getToknRequestCall, SocketHostChat } from '../../util/utilities'
import SocketClient from 'socket.io-client';
import { Toast } from '../../components'
import { v4 as uuidv4 } from 'uuid'
import Head from 'next/head'

const rtm = new RtmClient()
var chatScript = null

const recentTab = {
    CHAT: 'caht',
    CALL: 'call',
    CONTACT: 'contact'
}

class Chat extends React.Component {

    static async getInitialProps(ctx) {

        console.log("ctx", ctx)
        return {
            query: ctx.query,
        }


    }

    constructor(props) {
        super(props)

        this.initRTM()

        this.state = {
            account: null,
            currentPeer: {},
            currentContact: { exhibitorStaffList: [], contactDetail: {} },
            recentChat: [],
            currentRecentTab: recentTab.CHAT,
            currentCalling: {}
        }

        this.socketVideo = SocketClient(SocketHostVideo(tokenAccount()));
        this.socketMessage = SocketClient(SocketHostChat(tokenAccount()))
    }

    componentDidMount() {


        chatScript = new ChatScript()
        chatScript.init(this.onEnterMessage.bind(this))
        chatScript.initImg()
        chatScript.initChat()

        const account = userAccount()
        this.setState({ account })
        console.log("account", account)
        if (account) {
            this.rtmLogin(account.accountID)
        }




        this.recieveVideo()


    }

    recieveVideo() {

        console.log("query", this.props.query)
        if (this.props.query && this.props.query.token) {
            const request = getRequestCall(window.atob(this.props.query.token).toString())
            console.log("request", request)
            console.log("expired", request.expired)
            console.log("current", new Date().getTime())

            if (request.expired > new Date().getTime()) {
                if (request != "" && request.action === 'video' || request.action === 'audio') {

                    this.loadRecentChatByID(request)


                }


            } else {
                Router.replace('/chat')
            }

        }
    }


    initRTM() {

        rtm.on('ConnectionStateChanged', (newState, reason) => {
            console.log('reason', reason)
            console.log('newState', newState)

            console.log('newState', ['newState: ' + newState, ', reason: ', reason].join(''))

            if (newState === 'ABORTED') {
                if (reason === 'REMOTE_LOGIN') {
                    console.log('You have already been kicked off!')
                    rtm.clearState()
                }
            }
        })

        rtm.on('MessageFromPeer', ((message, peerId) => {
            console.log('message ' + message.text + ' peerId' + peerId)

            this.addToRecentChat({ visitorID: peerId }, JSON.parse(message.text))
            if (this.state.currentPeer.visitorID === peerId) {
                this.chat.receiveMessage(JSON.parse(message.text), peerId, true, false)
                this.readMessage(peerId, userAccount().accountID)
            }



        }).bind(this))

        rtm.on('MemberJoined', ({ channelName, args }) => {
            const memberId = args[0]
            console.log('channel ', channelName, ' member: ', memberId, ' joined')

        })

        rtm.on('MemberLeft', ({ channelName, args }) => {
            const memberId = args[0]
            console.log('channel ', channelName, ' member: ', memberId, ' joined')

        })

        rtm.on('ChannelMessage', ({ channelName, args }) => {
            const [message, memberId] = args
            console.log('channel ', channelName, ', messsage: ', message.text, ', memberId: ', memberId)

        })

    }

    rtmLogin(accountName) {

        try {
            rtm.init()
            window.rtm = rtm
            rtm.login(accountName).then(() => {
                console.log('login')
                rtm._logined = true
                console.log('Login: ' + accountName)

                this.loadRecentChat()

            }).catch((err) => {
                console.log(err)
            })
        } catch (err) {

            console.error('Login failed, please open console see more details', err)
        }

    }

    rtmLogout() {

        if (!rtm._logined) {
            return
        }
        rtm.logout().then(() => {
            console.log('logout', 'Logout: ' + rtm.accountName)
            rtm._logined = false

        }).catch((err) => {
            console.log('Logout failed, please open console see more details', err)
        })

    }

    rtmJoinRoom(channelName) {

        if (!rtm._logined) {
            return
        }


        if (rtm.channels[channelName] ||
            (rtm.channels[channelName] && rtm.channels[channelName].joined)) {
            console.log('You already joined')
            return
        }

        rtm.joinChannel(channelName).then(() => {
            console.log(rtm.accountName + ' join channel success')
            rtm.channels[channelName].joined = true
        }).catch((err) => {
            console.error('Join channel failed, please open console see more details.', err)
        })

    }

    rtmLeave(channelName) {

        if (!rtm._logined) {
            console.log("Please Login First")
            return
        }



        if (!rtm.channels[channelName] ||
            (rtm.channels[channelName] && !rtm.channels[channelName].joined)
        ) {

        }

        rtm.leaveChannel(channelName).then(() => {

            console.log(rtm.accountName + ' leave channel success')
            if (rtm.channels[channelName]) {
                rtm.channels[channelName].joined = false
                rtm.channels[channelName] = null
            }
        }).catch((err) => {
            console.error('Leave channel failed, please open console see more details.', err)
        })

    }

    rtmSendMessageToChanel(channelName, channelMessage) {

        if (!rtm._logined) {
            console.log('Please Login First')
            return
        }


        if (!rtm.channels[channelName] ||
            (rtm.channels[channelName] && !rtm.channels[channelName].joined)
        ) {
            console.log('Please Join first')
        }

        rtm.sendChannelMessage(params.channelMessage, params.channelName).then(() => {

            console.log('account: ' + rtm.accountName + ' send : ' + channelMessage + ' channel: ' + channelName)

        }).catch((err) => {
            console.error('Send message to channel ' + channelName + ' failed, please open console see more details.', err)
        })

    }

    rtmSendMessageToPeer(peerId, peerMessage) {

        if (!rtm._logined) {
            console.log('Please Login First')
            return
        }


        rtm.sendPeerMessage(JSON.stringify(peerMessage), peerId).then(() => {

            console.log('account: ' + rtm.accountName + ' send : ' + peerMessage + ' peerId: ' + peerId)

            this.addToRecentChat({ visitorID: peerId }, peerMessage)

        }).catch((err) => {
            console.error('Send message to peer ' + peerId + ' failed, please open console see more details.', err)
        })

    }

    async rtmPeersStatus(memberIdList) {

        if (!rtm._logined) {
            console.log('Please Login First')
            return {}
        }

        return rtm.queryPeersOnlineStatus(memberIdList)

    }

    rtmPeerStatus(memberId) {

        if (!rtm._logined) {
            console.log('Please Login First')
            return
        }

        rtm.queryPeersOnlineStatus(memberId).then((res) => {
            console.log('memberId: ' + memberId + ', online: ' + res[memberId])
        }).catch((err) => {
            console.error('query peer online status failed, please open console see more details.', err)
        })

    }

    onSelectPeerChat(peer, action) {

        if (this.videoCall.getStateCall() === stateCall.IDLE) {
            if (action === 'chat') {
                $('.chitchat-main .tabto').removeClass("active");
                $('.chat-content').addClass("active");

            } else if (action === 'video') {

                $('.chitchat-main .tabto').removeClass("active");
                $('.video-content').addClass("active");

            } else if (action === 'audio') {
                $('.chitchat-main .tabto').removeClass("active");
                $('.video-content').addClass("active");
            }
        } else {

            console.log("peer.visitorID", peer.visitorID)
            if (peer.visitorID != this.videoCall.getPeerAccountID()) {

                if (action === 'chat') {
                    $('.chitchat-main .tabto').removeClass("active");
                    $('.chat-content').addClass("active");

                }

                $("#remote-call-hold").removeClass("hide")
                $("#remote-call-hold").append($("#remote_video_call"));


                $("#remote-call-hold").append($("#request-profile"));
                $("#request-profile").removeClass("hide")

            } else {
                $('.chitchat-main .tabto').removeClass("active");
                $('.video-content').addClass("active");

                $("#remote-call-hold").addClass("hide")
                $("#remote-call-container").append($("#remote_video_call"));

            }

        }

        this.state.recentChat.forEach(element => {
            if (element.visitorID === peer.visitorID) {
                this.readMessage(element.visitorID, userAccount().accountID)
            }
        })

        this.setState({ currentPeer: peer })

        this.chat.loadHistory(peer, 1)

    }

    onSelectContact(contact) {
        this.setState({ currentContact: contact })
        if (contact.exhibitorID != this.state.currentContact.exhibitorID) {
            this.clearSelectStaff()
        }
    }

    onPeerAccept(peer, type) {
        if (type != 'audio') {
            $("#request-profile").addClass("hide")
        }


    }

    onStartCall(peer) {

        $(`#${peer.visitorID}-recent-chat`).addClass("hide")
        $(`#${peer.visitorID}-calling`).removeClass("hide")

        this.setState({ currentCalling: peer })

    }

    onEndCall(peer) {

        $(`.detail-recent`).removeClass("hide")
        $(`.active_phone`).addClass("hide")

        if ($("#remote-call-hold")) {
            $("#remote-call-hold").addClass("hide")
        }
        this.setState({ currentCalling: {} })
    }


    search(value) {

        if (this.state.currentRecentTab === recentTab.CHAT) {
            this.loadRecentChat(value)
        } else if (this.state.currentRecentTab === recentTab.CONTACT) {
            this.getContactList(value)
        } else if (this.state.currentRecentTab === recentTab.CALL) {
            this.getCallList(value)
        }
    }

    render() {

        const { currentPeer, currentContact, recentChat } = this.state


        return (

            <div>
                <Head>
                    <link rel="stylesheet" type="text/css" href="/static/chat/css/style.css" media="screen" id="color" />
                    <link href="/static/css/chat.css" rel="stylesheet" />
                </Head>
                <nav className="navbar  fixed-top navbar-expand-lg navbar-light nav-bar-chat" style={{ backgroundColor: 'white', }}>
                    <a className="navbar-brand" href="#">
                        <img src={'../../static/img/logo_insight.png'} width="200" alt="logo" />
                    </a>
                </nav>

                <div style={{ paddingTop: 70 }}>
                    <div className="sidebar-active">

                        <div className="chitchat-container sidebar-toggle">

                            <aside className="chitchat-left-sidebar left-disp">
                                <div className="recent-default dynemic-sidebar active">

                                    <div className="chat custom-scroll">

                                        <HeaderRecent onSearchEnter={this.search.bind(this)} />

                                        <div className="theme-tab tab-sm chat-tabs">
                                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                                <li className="nav-item" onClick={() => {
                                                    this.setState({ currentRecentTab: recentTab.CHAT })
                                                }}><a className="nav-link button-effect active" id="chat-tab" data-toggle="tab" href="#chat" role="tab" aria-controls="chat" aria-selected="true"><i className="fas fa-comment-alt mr-2"></i>Chat</a></li>
                                                <li className="nav-item" onClick={() => {
                                                    this.setState({ currentRecentTab: recentTab.CALL })
                                                    this.getCallList()

                                                }}><a className="nav-link button-effect" id="call-tab" data-toggle="tab" href="#call" role="tab" aria-controls="call" aria-selected="false"><i className="fas fa-phone-alt mr-2"></i>Call</a></li>

                                                <li className="nav-item" onClick={() => {
                                                    this.setState({ currentRecentTab: recentTab.CONTACT })
                                                    this.getContactList()
                                                }}
                                                ><a className="nav-link button-effect" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false"> <i className="fas fa-user-friends mr-2"></i>Contact</a></li>
                                            </ul>
                                            <div className="tab-content tab-recent-content  custom-scroll" id="myTabContent">
                                                <ChatList
                                                    recentChat={recentChat}
                                                    onSelectPeerChat={this.onSelectPeerChat.bind(this)}
                                                />
                                                <CallList getCallList={getCallList => { this.getCallList = getCallList }}
                                                    onSelectPeerChat={this.onSelectPeerChat.bind(this)} />
                                                <ContactList getContactList={(getContactList) => { this.getContactList = getContactList }} onSelectContact={this.onSelectContact.bind(this)} />

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </aside>

                            <div className="chitchat-main small-sidebar" id="content" >


                                <ExhibitorDetail currentContact={currentContact} onRef={ref => {
                                    this.voiceCall = ref
                                }} />
                                <CallingVoice currentPeer={currentPeer} />
                                <CallingVideo
                                    onEnterMessage={this.onEnterMessage.bind(this)}
                                    onVideoCancelCall={this.onVideoCancelCall.bind(this)}
                                    onStartCall={this.onStartCall.bind(this)}
                                    onPeerAccept={this.onPeerAccept.bind(this)}
                                    onEndCall={this.onEndCall.bind(this)}
                                    onRef={ref => {
                                        this.videoCall = ref
                                    }} />
                                <MainChat
                                    onSelectPeerChat={this.onSelectPeerChat.bind(this)}
                                    onEnterMessage={this.onEnterMessage.bind(this)}
                                    currentPeer={currentPeer}
                                    onVideoCallClick={this.onVideoCallClick.bind(this)}
                                    onRef={ref => {
                                        this.chat = ref
                                    }} />
                                <MainCall />
                                <MainContact
                                    onVideoCallClick={this.onVideoCallClick.bind(this)}
                                    currentContact={currentContact}
                                    onSelectPeerChat={this.onSelectPeerChat.bind(this)} />


                            </div>
                            <ContactProfile currentPeer={currentPeer} />
                            <MinimalRight
                                onVideoCallClick={this.onVideoCallClick.bind(this)}
                                clearSelectStaff={ref => this.clearSelectStaff = ref}
                                currentContact={currentContact}
                                onSelectPeerChat={this.onSelectPeerChat.bind(this)} />
                        </div>

                    </div>

                    <div className="container-video-small-hold hide" id="remote-call-hold"></div>

                </div>
                <Toast toast={toast => this.toast = toast} />
            </div>


        )
    }

    async onVideoCallClick(peer, action) {

        if (this.videoCall.getStateCall() === stateCall.IDLE) {


            const room = uuidv4()
            await this.videoCall.joinRoom(room, action, peer, 'out')

            const { token, createDate, ...other } = userAccount()
            const tokenRequest = getToknRequestCall({ ...other, requestID: this.state.account.accountID, room: room, action: action })

            this.socketVideo.emit('onRequest', this.state.currentPeer.visitorID, tokenRequest)


        } else {

            this.toast("Failure", "Cannot call", "error")

        }

    }

    onVideoCancelCall(peer, room, action) {
        console.log("onCancel", peer)

        const { token, createDate, ...other } = userAccount()
        const tokenRequest = getToknRequestCall({ ...other, requestID: this.state.account.accountID, room: room, action: action })

        this.socketVideo.emit('onCancel', peer.visitorID, tokenRequest)
    }



    onEnterMessage(data, visitorID) {

        console.log("onEnterMessage", visitorID)

        const currentVisitorID = visitorID || this.state.currentPeer.visitorID

        console.log("onEnterMessage", currentVisitorID)


        return new Promise((resolve, reject) => {

            const parameter = {
                sendTo: currentVisitorID,
                type: data.type,
                message: data.text,
                callTime: data.callTime || 0
            }


            post(api.SEND_MESSAGE, parameter, tokenAccount()).then(response => {

                this.rtmSendMessageToPeer(currentVisitorID, { ...data, messageID: response.data.result.messageID })

                if (currentVisitorID === this.state.currentPeer.visitorID) {
                    this.chat.sendMessage({ ...data, messageID: response.data.result.messageID }, false, true)
                } else {
                    $(`#${currentVisitorID}-recent-chat`).html(`${data.text}`);
                }


                resolve()
            }).catch(error => {
                this.chat.sendMessage({ text: 'Unable to send message', type: messageType.TEXT, date: moment(new Date()).format("DD-MM-YYYY HH:mm:ss") }, false, true)
                reject()
            })


        })

        // 5e96dff26f4c780011447b3e
    }

    addToRecentChat(peer, message) {

        var isRecent = false
        var currentPeer = null
        this.state.recentChat.forEach(element => {
            if (element.visitorID === peer.visitorID) {
                isRecent = true
                currentPeer = element
            }
        })

        if (!isRecent) {
            this.loadRecentChat()
        } else {
            this.moveSendToFirst(currentPeer, message)
        }
    }

    moveSendToFirst(peer, message) {

        var recentChat = this.state.recentChat
        if (recentChat.length > 0) {
            const currentChatIndex = this.state.recentChat.indexOf(peer)
            console.log("peer", peer)
            if (currentChatIndex > -1) {
                recentChat.splice(currentChatIndex, 1)
                if (this.state.currentPeer.visitorID != peer.visitorID) {
                    peer.countUnRead += 1
                }

                console.log("message", message)
                peer.lastMessages = message

                recentChat.splice(0, 0, peer)
            }

        }

        this.setState({ recentChat }, () => {

            $(`.detail-recent`).removeClass("hide")
            $(`.active_phone`).addClass("hide")

            if (this.state.currentCalling.visitorID) {
                $(`#${this.state.currentCalling.visitorID}-recent-chat`).addClass("hide")
                $(`#${this.state.currentCalling.visitorID}-calling`).removeClass("hide")

            }

        })
    }

    readMessage(visitorID, exhibitorStaffID) {

        const parameter = {
            visitorID: visitorID,
            exhibitorStaffID: exhibitorStaffID
        }

        put(api.READ_MESSAGE, parameter, tokenAccount())
        this.socketMessage.emit("onReadMessage", visitorID, { peerID: exhibitorStaffID })
    }

    loadRecentChat(keyword) {

        const parameter = {
            keyword: keyword || ""
        }

        post(`${api.RECENT_CHAT}`, parameter, tokenAccount()).then(response => {

            if (this.props.query && this.props.query.staff) {
                response.data.result.forEach((element, index) => {
                    if (element.visitorID === this.props.query.staff || element.visitorID === this.state.currentPeer.visitorID) {

                        setTimeout(() => {

                            this.setState({ currentPeer: response.data.result[index] })
                            $('.chitchat-main .tabto').removeClass("active");
                            $('.chat-content').addClass("active");
                            $('.item-chat').removeClass("active");
                            const idChatItem = `#${element.visitorID}-item-chat`
                            $(idChatItem).addClass("active");
                            this.chat.loadHistory(element, 1)

                        }, 500);
                    }
                });
            }
            this.setState({ recentChat: response.data.result }, () => {
                this.loadRecentStatusOnline()
            })
        })

    }

    loadRecentStatusOnline() {

        const peerIdList = []
        this.state.recentChat.forEach((peer, index) => {
            peerIdList.push(peer.visitorID)
        })

        this.rtmPeersStatus(peerIdList).then(res => {

            const peerRecent = []
            this.state.recentChat.forEach((peer, index) => {
                peer.statusOnline = res[peer.visitorID]
                peerRecent.push(peer)
            })

            this.setState({ recentChat: peerRecent })
        })
    }

    loadRecentChatByID(request) {

        const parameter = {
            visitorID: request.requestID
        }

        post(`${api.RECENT_BY_ID}`, parameter, tokenAccount()).then(response => {

            this.setState({ currentPeer: response.data.result }, () => {
                chatScript.openProfile()
                this.onSelectPeerChat(response.data.result)

                $('.chitchat-main .tabto').removeClass("active");
                $('.video-content').addClass("active");

                this.videoCall.joinRoom(request.room, request.action, { ...request, ...response.data.result }, 'in')
            })

        })

    }
}

export default withAuth(Chat, [ROLES.EXHIBITOR_STAFF, ROLES.SUPER_ADMIN])