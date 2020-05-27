import React, { useEffect, useState } from 'react'
import ChatScript from '../../components/chat/chat-script'
import { getImageProfile, isJSON, bytesToSize, iconFile, validateURL, chatDate,} from '../../util/utilities'
import api from '../../services/webservice'
import { get, post, put } from '../../services/http'
import { tokenAccount, userAccount } from '../../services/auth'
import { messageType } from '../../util/constants'
import moment from 'moment'
import { SRLWrapper } from "simple-react-lightbox";
import SimpleReactLightbox from "simple-react-lightbox";
import SocketClient from 'socket.io-client';
import { SocketHostChat } from '../../util/utilities'

const options = {
    overlayColor: "rgb(0, 0, 0,0.95)",
    showCaption: false,
    buttonsBackgroundColor: "rgba(0, 0, 0, 1)",
    buttonsIconColor: "rgba(255, 255, 255, 1)",
    showThumbnails: true,
    transitionSpeed: 300,
    transitionTimingFunction: "linear",
    showDownloadButton: true,
};


class MainChat extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            isLoading: false,
            account: userAccount(),
            page: 1,
            count: 10,
            currentChatID: ""
        }

        if (props.onRef) {
            props.onRef(this)
        }

    }


    componentDidMount() {

        this.initSocket()
    }

    initSocket(){
        const socket = SocketClient(SocketHostChat(tokenAccount()));
        socket.on('onUnsend', (data) => {

            console.log("onUnsend",data)
            if ($(`#${data._id}-message-items`)){
                $(`#${data._id}-message-items`).remove()
            }
            

        })

        socket.on('onRecieve', (data) => {
            console.log("onRecieve", data)
        })

        socket.on('onReadMessage', (data) => {
            console.log("onReadMessage", data)

            if (data.peerID === this.props.currentPeer.visitorID) {
                $('.read-status').removeClass("hide")
            }

        })

        socket.emit("joinRoom", this.state.account.accountID)

    }



    loadHistory(peer, page) {

        const parameter = {
            page: page,
            count: this.state.count,
            visitorID: peer.visitorID
        }

        console.log("paramter", parameter)

        this.setState({ isLoading: true })


        post(api.HISTORY_CHAT, parameter, tokenAccount()).then(response => {

            setTimeout(() => {
                this.setState({ isLoading: false, page: page + 1, currentChatID: response.data.result.chatID })
            }, 500);

            var isScrollBottom = false
            var isAddTop = true
            var messageList = response.data.result.chatList

            if (page === 1) {
                $('.messages .chatappend').empty()
                isScrollBottom = true
                isAddTop = false
                messageList = response.data.result.chatList.reverse()
            }

            messageList.forEach(chat => {

                if (!chat.staffDelete) {
                    if (chat.accountID === peer.visitorID) {

                        this.receiveMessage(chat, peer.visitorID, isScrollBottom, isAddTop)
                    } else {
                        this.sendMessage(chat, isAddTop,false)
                    }
                }


            })

         
            if (isScrollBottom) {
                $(".messages").animate({ scrollTop: $('#contact-chat').height() }, "fast");
            }


        }).catch(error => {

            this.setState({ isLoading: false })
            console.log("error", error)
        })



    }


    render() {

        const { currentPeer } = this.props

        return (<div className="chat-content tabto">
            <div className="messages custom-scroll active" id="chating" onScroll={(e) => {

                const element = document.getElementById("chating")
                if (element.scrollTop <= 0 && !this.state.isLoading) {
                    this.loadHistory(currentPeer, this.state.page)
                }


            }}>
                <div className="contact-details">
                    <div className="row">
                        <form className="form-inline search-form">
                            <div className="form-group">
                                <input className="form-control-plaintext" type="search" placeholder="Search.." />
                                <div className="icon-close close-search"> </div>
                            </div>
                        </form>
                        <div className="col-7">
                            <div className="media left">
                                <div className="media-left mr-3">
                                    <div className={`profile ${currentPeer.statusOnline ? 'online':'offline'} menu-trigger`}>
                                        <img src={getImageProfile(currentPeer.imageProfile)} alt="" className="rounded-circle" width="60" height="60" style={{ objectFit: 'cover' }}></img>
                                    </div>

                                </div>
                                <div className="media-body">
                                    <h5>{`${currentPeer.firstName} ${currentPeer.lastName}`}</h5>
                                    <div className={`badge ${currentPeer.statusOnline ? 'badge-success' : 'badge-muted'}`}>{currentPeer.statusOnline ? 'Active' : 'Offline'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <ul className="calls text-right">
                                <li><a className="icon-btn btn-light button-effect" onClick={() =>{
                                    this.props.onSelectPeerChat(currentPeer, 'audio')
                                    this.props.onVideoCallClick(currentPeer, "audio")

                                }} href="#" ><i className="fas fa-phone-alt"></i></a></li>
                                
                                <li><a className="icon-btn btn-light button-effect" onClick={() =>{
                                    this.props.onSelectPeerChat(currentPeer, 'video')
                                    this.props.onVideoCallClick(currentPeer,"video")

                                }} href="#" data-tippy-content="Quick Video Call" data-toggle="modal" data-target="#videocall"><i className="fas fa-video"></i></a></li>

                            </ul>
                        </div>
                    </div>
                </div>
                <SimpleReactLightbox >
                    <SRLWrapper options={options}>
                        <div className="contact-chat" id="contact-chat">

                            <ul className="chatappend" style={{ marginBottom: 45 }}>
                               
                            </ul>

                        </div>

                    </SRLWrapper>
                </SimpleReactLightbox>

            </div>
            <div className="messages custom-scroll" id="blank">
                <div className="contact-details">
                    <div className="row">

                        <div className="col">
                            <ul className="calls text-right">
                                <li><a className="icon-btn btn-light button-effect" href="#" data-tippy-content="Quick Audio Call" data-toggle="modal" data-target="#audiocall"><i data-feather="phone" /></a></li>
                                <li><a className="icon-btn btn-light button-effect" href="#" data-tippy-content="Quick Video Call" data-toggle="modal" data-target="#videocall"><i data-feather="video" /></a></li>

                            </ul>
                        </div>
                    </div>
                </div>


            </div>

            <div className="message-input">
                <div className="wrap emojis-main"><a className="icon-btn btn-outline-primary button-effect mr-3 toggle-sticker outside" href="#">
                    <svg id="Layer_1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="2158px" height="2148px" viewBox="0 0 2158 2148" enableBackground="new 0 0 2158 2148" xmlSpace="preserve">
                        <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#000000" strokeWidth={60} strokeMiterlimit={10} d="M699,693                        c0,175.649,0,351.351,0,527c36.996,0,74.004,0,111,0c18.058,0,40.812-2.485,57,1c11.332,0.333,22.668,0.667,34,1                        c7.664,2.148,20.769,14.091,25,20c8.857,12.368,6,41.794,6,62c0,49.329,0,98.672,0,148c175.649,0,351.351,0,527,0                        c0-252.975,0-506.025,0-759C1205.692,693,952.308,693,699,693z" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M886,799c59.172-0.765,93.431,25.289,111,66c6.416,14.867,14.612,39.858,9,63                        c-2.391,9.857-5.076,20.138-9,29c-15.794,35.671-47.129,53.674-90,63c-20.979,4.563-42.463-4.543-55-10                        c-42.773-18.617-85.652-77.246-59-141c10.637-25.445,31.024-49,56-60c7.999-2.667,16.001-5.333,24-8                        C877.255,799.833,882.716,801.036,886,799z" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M1258,799c59.172-0.765,93.431,25.289,111,66c6.416,14.867,14.612,39.858,9,63                        c-2.391,9.857-5.076,20.138-9,29c-15.794,35.671-47.129,53.674-90,63c-20.979,4.563-42.463-4.543-55-10                        c-42.773-18.617-85.652-77.246-59-141c10.637-25.445,31.024-49,56-60c7.999-2.667,16.001-5.333,24-8                        C1249.255,799.833,1254.716,801.036,1258,799z" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M1345,1184c-0.723,18.71-11.658,29.82-20,41c-18.271,24.489-50.129,37.183-83,47                        c-7.333,1-14.667,2-22,3c-12.013,2.798-33.636,5.15-44,3c-11.332-0.333-22.668-0.667-34-1c-15.332-3-30.668-6-46-9                        c-44.066-14.426-80.944-31.937-110-61c-22.348-22.353-38.992-45.628-37-90c0.667,0,1.333,0,2,0c9.163,5.585,24.723,3.168,36,6                        c26.211,6.583,54.736,7.174,82,14c34.068,8.53,71.961,10.531,106,19c9.999,1.333,20.001,2.667,30,4c26.193,6.703,54.673,7.211,82,14                        C1304.894,1178.445,1325.573,1182.959,1345,1184z" />
                        <polygon fillRule="evenodd" clipRule="evenodd" points="668.333,1248.667 901.667,1482 941.667,1432 922.498,1237.846                         687,1210.667 " />
                    </svg></a>
                    <div className="dot-btn dot-primary mr-3"><a className="icon-btn btn-outline-primary button-effect toggle-emoji" href="#"><i className="far fa-smile-beam"></i></a></div>
                    <div className="contact-poll"><a className="icon-btn btn-outline-primary mr-4 outside" href="#"><i className="fa fa-plus" /></a>


                        <div className="contact-poll-content">
                            <ul>
                                <li style={{ paddingLeft: 0 }}><a href="#" onClick={() => {

                                    $("#file-image").click();

                                }} >
                                    <input type="file" name="file-image" accept=".png, .jpg, .jpeg,.gif" multiple id="file-image" className="inputfile" style={{ display: 'none' }} onChange={(e) => {

                                        this.sendUploadFile(e.target.files, messageType.IMAGE)
                                        $('#file-image').val(null);
                                    }} />
                                    <i className="far fa-image mr-3"></i><label className="h4">Image</label></a></li>

                                <li style={{ paddingLeft: 0 }}><a href="#" onClick={() => {

                                    $("#file-video").click();

                                }} ><i className="fas fa-film mr-3"> <input type="file" name="file-video" accept="video/*" multiple id="file-video" className="inputfile" style={{ display: 'none' }} onChange={(e) => {

                                    this.sendUploadFile(e.target.files, messageType.VIDEO)
                                    $('#file-video').val(null);

                                }} /></i><label className="h4">Video</label></a></li>

                                <li style={{ paddingLeft: 0 }}><a href="#" onClick={() => {

                                    $("#file-document").click();

                                }}> <input type="file" name="file-document" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.pdf,text/plain,.doc,.docm,.docx,.bmp,.ppt,.pptx" multiple id="file-document" className="inputfile" style={{ display: 'none' }} onChange={(e) => {

                                    this.sendUploadFile(e.target.files, messageType.FILE)
                                    $('#file-document').val(null);

                                }} /><i className="far fa-file-alt mr-3"></i><label className="h4">Document</label></a></li>

                                <li style={{ paddingLeft: 0 }}><a href="#" onClick={() => {

                                    $("#file-attach").click();

                                }}><input type="file" name="file-attach" accept=".zip,.rar,.tgz" multiple id="file-attach" className="inputfile" style={{ display: 'none' }} onChange={(e) => {

                                    this.sendUploadFile(e.target.files, messageType.FILE)
                                    $('#file-attach').val(null);

                                }} /><i className="fas fa-paperclip mr-3"></i><label className="h4">Attach</label></a></li>

                            </ul>
                        </div>
                    </div>
                    <input className="setemoj imput-message" id="setemoj" type="text" placeholder="Write your message..." />

                    <button className="submit icon-btn btn-primary disabled ml-3" id="send-msg" disabled="disabled"><i className="fas fa-paper-plane"></i></button>
                    <div className="emojis-contain">
                        <div className="emojis-sub-contain custom-scroll">
                            <ul>
                                <li>😀</li>
                                <li>😁</li>
                                <li>😂</li>
                                <li>😃</li>
                                <li>😄</li>
                                <li>😅</li>
                                <li>😆</li>
                                <li>😇</li>
                                <li>😈</li>
                                <li>😉</li>
                                <li>😊</li>
                                <li>😋</li>
                                <li>😌</li>
                                <li>😍</li>
                                <li>😎</li>
                                <li>😏</li>
                                <li>😐</li>
                                <li>😑</li>
                                <li>😒</li>
                                <li>😓</li>
                                <li>😔</li>
                                <li>😕</li>
                                <li>😖</li>
                                <li>😗</li>
                                <li>😘</li>
                                <li>😙</li>
                                <li>😚</li>
                                <li>😛</li>
                                <li>😜</li>
                                <li>😝</li>
                                <li>😞</li>
                                <li>😟</li>
                                <li>😠</li>
                                <li>😡</li>
                                <li>😢</li>
                                <li>😣</li>
                                <li>😥</li>
                                <li>😦</li>
                                <li>😧</li>
                                <li>😨</li>
                                <li>😩</li>
                                <li>😪</li>
                                <li>😫</li>
                                <li>😭</li>
                                <li>😮</li>
                                <li>😯</li>
                                <li>😰</li>
                                <li>😱</li>
                                <li>😲</li>
                                <li>😳</li>
                                <li>😴</li>
                                <li>😵</li>
                                <li>😶</li>
                                <li>😷</li>
                                <li>😸</li>
                                <li>😹</li>
                                <li>😺</li>
                                <li>😻</li>
                                <li>😼</li>
                                <li>😽</li>
                                <li>😾</li>
                                <li>🙀</li>
                                <li>🙃</li>
                            </ul>
                        </div>
                    </div>
                    <div className="sticker-contain">
                        <div className="sticker-sub-contain custom-scroll">
                            <ul>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/3.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/4.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/1.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/3.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/2.gif" alt="sticker"  /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/5.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/6.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/7.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/8.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/9.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/10.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/11.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/12.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/13.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/14.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/15.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/16.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/17.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/18.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/19.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/20.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/21.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/22.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/23.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/24.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/25.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/26.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/27.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/28.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/29.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/30.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/31.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/32.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/33.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/34.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/35.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/36.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/37.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/38.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/39.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/40.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/41.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/42.gif" alt="sticker" /></a></li>
                                <li><a href="#"><img className="img-fluid" src="/static/chat/images/sticker/43.gif" alt="sticker" /></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }

    sendUploadFile(files, type) {

        var isFileLarge = false
        for (var i = 0, file; file = files[i]; i++) {

            const fileSize = ((file.size / 1024) / 1024)
            if (fileSize > 30) {
                isFileLarge = true
            }
        }

        if (isFileLarge) {
            this.sendMessage({ text: "Unable to send file. File size limit 30MB", type: messageType.text, date: moment(new Date()).format("DD-MM-YYYY HH:mm:ss") },false,true)

        } else {

            const uploadFileList = []

            for (var i = 0, file; file = files[i]; i++) {

                const parameter = new FormData()
                parameter.append("file", file)

                uploadFileList.push(post(`${api.UPLOAD_FILE_CHAT}${this.state.currentChatID}`, parameter, tokenAccount()))
            }

            const date = new Date().getTime()
            this.sendLoadingMessage(date, { text: "", date: moment(new Date()).format("DD-MM-YYYY HH:mm:ss") })

            $(".messages").animate({ scrollTop: $('#contact-chat').height() }, "fast");

            Promise.all(uploadFileList).then(response => {

                $(`#${date}-chat-loading`).remove()

                if (type === messageType.IMAGE) {

                    const imageList = []

                    response.forEach(data => {
                        imageList.push(data.data.result[0])
                    })

                    this.props.onEnterMessage({
                        text: JSON.stringify(imageList),
                        type: type,
                        date: moment(new Date()).format("DD-MM-YYYY HH:mm:ss")
                    })


                } else {
                    response.forEach(data => {

                        this.props.onEnterMessage({
                            text: JSON.stringify(data.data.result[0]),
                            type: type,
                            date: moment(new Date()).format("DD-MM-YYYY HH:mm:ss")
                        })

                    })
                }



            }).catch(error => {

                console.log("error", error)
                $(`#${date}-chat-loading`).remove()
                this.sendMessage({ text: "Unable to send file.", type: messageType.TEXT, date: moment(new Date()).format("DD-MM-YYYY HH:mm:ss") },false,true)
            })


        }

    }

    sendLoadingMessage(id, data) {

        $(`<li class="replies" id="${id}-chat-loading"> 
        <div class="media"> 
        <div class="profile mr-4 bg-size" style="background-image: url(&quot;${getImageProfile(this.state.account.imageProfile)}&quot;); background-size: cover; background-position: center center;"></div>
        <div class="media-body"> 
        <div class="contact-name"> <h5>${`${this.state.account.userFname} ${this.state.account.userLname}`}</h5> <h6>${chatDate(data.date)}</h6> <ul class="msg-box"> 
        <li> <h5>
        <div class="spinner-border text-info" role="status"></div>
        <span>Uploading...</span>
        </h5> </li></ul> </div></div></div></li>`).appendTo($('.messages .chatappend'))

        
    }

    sendMessage(data, isTop,animate) {

        if (isTop) {

            $('.messages .chatappend').prepend(this.chatSendElement(data,false))
        } else {
            this.chatSendElement(data,false).appendTo($('.messages .chatappend'))
        }

        const element = document.getElementById("chating")
        if (animate && element && element.scrollHeight >= (element.scrollTop + element.offsetHeight)) {
            $(".messages").animate({ scrollTop: $('#contact-chat').height() }, "fast");
        }
        $('.msg-setting').unbind()
        $('.msg-setting').on('click', function () {
            $(this).siblings('.msg-dropdown').toggle();
        });
       
        if (document.getElementById(`${data.messageID}-item-message-unsend`)){
            document.getElementById(`${data.messageID}-item-message-unsend`).onclick = () => {
                this.unSendMessage(data)
            }
        }
       

    }

    unSendMessage(message){

        put(api.UNSEND_MESSAGE, { chatID: this.state.currentChatID, messageID:message.messageID},tokenAccount()).then(() =>{
            $(`#${message.messageID}-message-items`).remove()
        })
        
    }

    chatSendElement(data,isSend) {

        const { currentPeer } = this.props 

      
        if (data.type === messageType.TEXT ) {

            $('.chat-main .active .details h6').html(`<span>${!isSend ? 'You' : currentPeer.firstName} : </span>` + data.text);

            const messageList = data.text.split(' ')
            var message = ""

            messageList.forEach(element =>{

                if (validateURL(element)){
                    message += " "+`<a href="${element}" target="_blank">${element}</a>`
                }else{
                    message += " " + element
                }
                
            })

            return (
                $(`<li id="${data.messageID}-message-items" class="${isSend ? 'sent' : 'replies'}"> 
                <div class="media"> <div class="profile mr-4 bg-size" style="background-image: url(&quot;${!isSend ? getImageProfile(this.state.account.imageProfile) : getImageProfile(currentPeer.imageProfile)}&quot;); background-size: cover; background-position: center center;"></div>
                <div class="media-body"> 
                <div class="contact-name"> <h5>${isSend ? `${currentPeer.firstName} ${currentPeer.lastName}` : `${this.state.account.userFname} ${this.state.account.userLname}`}</h5> 
                <h6>${chatDate(data.date)}</h6> 
                <ul class="msg-box"> 
                <li class="msg-setting-main">
                                                  <h5>${message}</h5> 
 ${!isSend ? `<div class="read-status badge badge-success sm ml-2 ${!data.visiterRead ? 'hide' : ''}"> R</div>` : ''}
                                                  ${!isSend ? `<div class="msg-dropdown-main">
                        <div class="msg-setting" ><i class="ti-more-alt"></i></div>
                        <div class="msg-dropdown">
                            <ul>
                                <li><a href="#" id="${data.messageID}-item-message-unsend"><i class="fas fa-undo-alt" ></i>Unsend</a></li>
                            </ul>
                        </div>
                    </div>`:''}
                                               

                                            </li>
                </ul> </div></div></div></li>`)

    
            )

        } else if (data.type === messageType.STICKER){

            $('.chat-main .active .details h6').html(`<span>${!isSend ? 'You' : currentPeer.firstName} : </span>` + data.text);
            return (
                $(`<li id="${data.messageID}-message-items" class="${isSend ? 'sent' : 'replies'}"> <div class="media"> <div class="profile mr-4 bg-size" style="background-image: url(&quot;${!isSend ? getImageProfile(this.state.account.imageProfile) : getImageProfile(currentPeer.imageProfile)}&quot;); background-size: cover; background-position: center center;"></div><div class="media-body"> <div class="contact-name"> <h5>${isSend ? `${currentPeer.firstName} ${currentPeer.lastName}` : `${this.state.account.userFname} ${this.state.account.userLname}`}</h5> <h6>${chatDate(data.date)}</h6> <ul class="msg-box"> 
                <li class="msg-setting-main"> 
                <h5>${data.text}</h5> 
                 ${!isSend ? `<div class="read-status badge badge-success sm ml-2 ${!data.visiterRead ? 'hide' : ''}"> R</div>` : ''}
               ${!isSend ? `<div class="msg-dropdown-main">
                        <div class="msg-setting" ><i class="ti-more-alt" ></i></div>
                        <div class="msg-dropdown">
                            <ul>
                                <li><a href="#" id="${data.messageID}-item-message-unsend"><i class="fas fa-undo-alt" ></i>Unsend</a></li>
                            </ul>
                        </div>
                    </div>` : ''}
                
                </li></ul> </div></div></div></li>`)
            )

        } else if (data.type === messageType.FILE) {

            const messageObject = isJSON(data.text) ? JSON.parse(data.text) : { fileName: "", fileSize: 0 }

            var fileName = messageObject.fileName.length > 0 ? messageObject.fileName.substring(messageObject.fileName.indexOf('_')+1, messageObject.fileName.length) : ''

            $('.chat-main .active .details h6').html(`<span>${!isSend ? 'You' : currentPeer.firstName} : </span>` + fileName);

            return (
                $(`<li  id="${data.messageID}-message-items" class="${isSend ? 'sent' : 'replies'}"> <div class="media"> <div class="profile mr-4 bg-size" style="background-image: url(&quot;${!isSend ? getImageProfile(this.state.account.imageProfile) : getImageProfile(currentPeer.imageProfile)}&quot;); background-size: cover; background-position: center center;"></div>
                <div class="media-body"> 
                <div class="contact-name"> 
                <h5>${isSend ? `${currentPeer.firstName} ${currentPeer.lastName}` : `${this.state.account.userFname} ${this.state.account.userLname}`}</h5> 
                <h6>${chatDate(data.date)}</h6> 
                 <ul class="msg-box">
                                        <li class="msg-setting-main">
                                            <div class="document">
                                                <i class="${iconFile(fileName)} font-primary " style="font-size:40px;"></i>
                                                <div class="details">
                                                    <h5>${fileName}</h5>
                                                    <h6>size ${bytesToSize(messageObject.fileSize)}</h6>
                                                </div>
                                                <div class="icon-btns"><a class="icon-btn btn-outline-light" href="${messageObject.fileUrl}" target="_blank"><i class="fas fa-arrow-down"> </i></a></div>
                                            </div>
                                             ${!isSend ? `<div class="read-status badge badge-success sm ml-2 ${!data.visiterRead ? 'hide' : ''}"> R</div>` : ''}
  ${!isSend ? `<div class="msg-dropdown-main">
                        <div class="msg-setting" ><i class="ti-more-alt" ></i></div>
                        <div class="msg-dropdown">
                            <ul>
                                <li><a href="#" id="${data.messageID}-item-message-unsend"><i class="fas fa-undo-alt" ></i>Unsend</a></li>
                            </ul>
                        </div>
                    </div>` : ''}
                                        </li>
                                    </ul>
                </div>
                
                </div></div></li>`)





            )
        } else if (data.type === messageType.IMAGE) {

            const messageObject = isJSON(data.text) ? JSON.parse(data.text) : []

            console.log("messageObject", messageObject)
            $('.chat-main .active .details h6').html(`<span>${!isSend ? 'You' : currentPeer.firstName} : </span>` + `Image`);

            var imageElement = ""
            
            messageObject.forEach(element => {

                imageElement += `<div class="col mt-2"> <img class="rounded" src="${element.fileUrl}" alt="" /> </div>`
            
            })

            return (
                $(`<li id="${data.messageID}-message-items" class="${isSend ? 'sent' : 'replies'}"> <div class="media"> <div class="profile mr-4 bg-size" style="background-image: url(&quot;${!isSend ? getImageProfile(this.state.account.imageProfile) : getImageProfile(currentPeer.imageProfile)}&quot;); background-size: cover; background-position: center center;"></div>
                <div class="media-body"> 
                <div class="contact-name"> 
                <h5>${isSend ? `${currentPeer.firstName} ${currentPeer.lastName}` : `${this.state.account.userFname} ${this.state.account.userLname}`}</h5> 
                <h6>${chatDate(data.date)}</h6> 
                 <ul class="msg-box">
                                                <li class="msg-setting-main">
                                                    <div class="document">
                                                        <div class="row">
                                                            ${imageElement}
                                                        </div>
                                                    </div>
                                                     ${!isSend ? `<div class="read-status badge badge-success sm ml-2 ${!data.visiterRead ? 'hide' : ''}"> R</div>` : ''}
  ${!isSend ? `<div class="msg-dropdown-main">
                        <div class="msg-setting" ><i class="ti-more-alt" ></i></div>
                        <div class="msg-dropdown">
                            <ul>
                                <li><a href="#" id="${data.messageID}-item-message-unsend"><i class="fas fa-undo-alt" ></i>Unsend</a></li>
                            </ul>
                        </div>
                    </div>` : ''}

                                                </li>
                                            </ul>
                </div>
                
                </div></div></li>`)





            )
        } else if (data.type === messageType.VIDEO) {

            const messageObject = isJSON(data.text) ? JSON.parse(data.text) : []

            console.log("messageObject", messageObject)
            $('.chat-main .active .details h6').html(`<span>${!isSend ? 'You' : currentPeer.firstName} : </span>` + `Video`);

            return (
                $(`<li id="${data.messageID}-message-items" class="${isSend ? 'sent' : 'replies'}"> <div class="media"> <div class="profile mr-4 bg-size" style="background-image: url(&quot;${!isSend ? getImageProfile(this.state.account.imageProfile) : getImageProfile(currentPeer.imageProfile)}&quot;); background-size: cover; background-position: center center;"></div>
                <div class="media-body"> 
                <div class="contact-name"> 
                <h5>${isSend ? `${currentPeer.firstName} ${currentPeer.lastName}` : `${this.state.account.userFname} ${this.state.account.userLname}`}</h5> 
                <h6>${chatDate(data.date)}</h6> 
                 <ul class="msg-box">
                                                <li class="msg-setting-main">
                                                    <div class="document">
                                                         <video width="300" controls class="chat-video">
                                                            <source src="${messageObject.fileUrl}"  />
                                                        </video>
                                                    </div>
                                                     ${!isSend ? `<div class="read-status badge badge-success sm ml-2 ${!data.visiterRead ? 'hide' : ''}"> R</div>` : ''}
  ${!isSend ? `<div id="${data.messageID}-message-items" class="msg-dropdown-main">
                        <div class="msg-setting" ><i class="ti-more-alt" ></i></div>
                        <div class="msg-dropdown">
                            <ul>
                                <li><a href="#" id="${data.messageID}-item-message-unsend"><i class="fas fa-undo-alt" ></i>Unsend</a></li>
                            </ul>
                        </div>
                    </div>` : ''}

                                                </li>
                                            </ul>
                </div>
                
                </div></div></li>`)

            )
        } else if (data.type === messageType.VIDEO_HISTORY){
            $('.chat-main .active .details h6').html(`<span>${!isSend ? 'You' : currentPeer.firstName} : </span>` + data.text);
            return (
                $(`<li id="${data.messageID}-message-items" class="${isSend ? 'sent' : 'replies'}"> <div class="media"> <div class="profile mr-4 bg-size" style="background-image: url(&quot;${!isSend ? getImageProfile(this.state.account.imageProfile) : getImageProfile(currentPeer.imageProfile)}&quot;); background-size: cover; background-position: center center;"></div><div class="media-body"> <div class="contact-name"> <h5>${isSend ? `${currentPeer.firstName} ${currentPeer.lastName}` : `${this.state.account.userFname} ${this.state.account.userLname}`}</h5> <h6>${chatDate(data.date)}</h6> <ul class="msg-box"> 
                <li class="msg-setting-main"> 
                 <div class="document">
                 <div class="container-icon-call">
                 <i class="fas fa-video font-primary" ></i>
                 </div>
                                               <div class="details">
                                                     <h5 class="ml-3">${data.text}</h5> 
                                                </div>
                                                
                                            </div>

                </li></ul> </div></div></div></li>`)
            )

        } else if (data.type === messageType.VOICE_HISTORY) {
            $('.chat-main .active .details h6').html(`<span>${!isSend ? 'You' : currentPeer.firstName} : </span>` + data.text);
            return (
                $(`<li id="${data.messageID}-message-items" class="${isSend ? 'sent' : 'replies'}"> <div class="media"> <div class="profile mr-4 bg-size" style="background-image: url(&quot;${!isSend ? getImageProfile(this.state.account.imageProfile) : getImageProfile(currentPeer.imageProfile)}&quot;); background-size: cover; background-position: center center;"></div><div class="media-body"> <div class="contact-name"> <h5>${isSend ? `${currentPeer.firstName} ${currentPeer.lastName}` : `${this.state.account.userFname} ${this.state.account.userLname}`}</h5> <h6>${chatDate(data.date)}</h6> <ul class="msg-box"> 
                <li class="msg-setting-main"> 
                 <div class="document">
                 <div class="container-icon-call">
                 <i class="fas fa-phone-alt font-primary" ></i>
                 </div>
                                               <div class="details">
                                                     <h5 class="ml-3">${data.text}</h5> 
                                                </div>
                                                
                                            </div>

                </li></ul> </div></div></div></li>`)
            )

        } else {

            $('.chat-main .active .details h6').html(`<span>${!isSend ? 'You' : currentPeer.firstName} : </span>` + data.text);
            return (
                $(`<li id="${data.messageID}-message-items" class="${isSend ? 'sent' : 'replies'}"> <div class="media"> <div class="profile mr-4 bg-size" style="background-image: url(&quot;${!isSend ? getImageProfile(this.state.account.imageProfile) : getImageProfile(currentPeer.imageProfile)}&quot;); background-size: cover; background-position: center center;"></div><div class="media-body"> <div class="contact-name"> <h5>${isSend ? `${currentPeer.firstName} ${currentPeer.lastName}` : `${this.state.account.userFname} ${this.state.account.userLname}`}</h5> <h6>${chatDate(data.date)}</h6> <ul class="msg-box"> 
                <li class="msg-setting-main"> 
                <h5>${data.text}</h5> 
                 ${!isSend ? `<div class="read-status badge badge-success sm ml-2 ${!data.visiterRead ? 'hide' : ''}"> R</div>` : ''}
                 ${!isSend ? `<div class="msg-dropdown-main">
                        <div class="msg-setting" ><i class="ti-more-alt" ></i></div>
                        <div class="msg-dropdown">
                            <ul>
                                <li><a href="#" id="${data.messageID}-item-message-unsend"><i class="fas fa-undo-alt" ></i>Unsend</a></li>
                            </ul>
                        </div>
                    </div>` : ''}
                </li></ul> </div></div></div></li>`)
            )
        }

    }

   

    typingMessage() {
        $(`<li class="sent last typing-m"> 
        <div class="media"> 
        <div class="profile mr-4 bg-size" style="background-image: url(&quot;../../../static/chat/images/contact/2.jpg&quot;); background-size: cover; background-position: center center; display: block;">
        <img class="bg-img" src="../../../static/chat/images/contact/2.jpg" alt="Avatar" style="display: none;"></div>
        <div class="media-body"> <div class="contact-name"> 
        <h5>Josephin water</h5> 
        <h6>01:42 AM</h6> 
        <ul class="msg-box"> <li> <h5> <div class="type"> <div class="typing-loader"></div></div></h5> </li></ul> </div></div></div></li>`).appendTo($('.messages .chatappend'));

        $(".messages").animate({ scrollTop: $('#contact-chat').height() }, "fast");

    }

    stopTyping() {
        $('.typing-m').hide();
    }

    receiveMessage(data, peerID, animate, isTop) {



        if (isTop) {
            $('.messages .chatappend').prepend(this.chatSendElement(data,true));
        } else {
            this.chatSendElement(data,true).appendTo($('.messages .chatappend'));
        }


        const element = document.getElementById("chating")
        if (animate && element.scrollHeight >= (element.scrollTop + element.offsetHeight)) {
            $(".messages").animate({ scrollTop: $('#contact-chat').height() }, "fast");
        }
        $('.msg-setting').unbind()
        $('.msg-setting').on('click', function () {
            $(this).siblings('.msg-dropdown').toggle();
        });

    }

}

export { MainChat }