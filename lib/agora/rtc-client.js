import { agora } from '../../util/constants'
import { isFirefox} from '../../util/utilities'
import EventEmitter from 'events'
// import AgoraRTC from 'agora-rtc-sdk';
import * as $ from 'jquery';
import {  addView, removeView } from './rtc-common';

const RtcTokenBuilder = require('./token/RtcTokenBuilder').RtcTokenBuilder;
const RtcRole = require('./token/RtcTokenBuilder').Role;
const Priviledges = require('./token/AccessToken').priviledges;

export default class RTCClient extends EventEmitter{

    constructor(localStreams) {

        super()

        this._client = null;
        this._joined = false;
        this._published = false;

        this._params = {};
        this._showProfile = false;

        this._localStream = null;
        this._remoteStreams = [];
        this.localStreams = localStreams || []
    }

    getToken(channelName, account,uid){

        const expirationTimeInSeconds = 3600
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

        const token = RtcTokenBuilder.buildTokenWithUid(agora.APPID, agora.APP_CERTIFICATE, channelName, uid, RtcRole.PUBLISHER, privilegeExpiredTs);
        // const token = RtcTokenBuilder.buildTokenWithAccount(agora.APPID, agora.APP_CERTIFICATE, channelName, account, RtcRole.PUBLISHER, privilegeExpiredTs);

        console.log("Token",token)
        return token
    }

    subscribeClientEvents(){

        const clientEvents = [
            'error',
            'peer-leave',
            'stream-published',
            'stream-removed',
            'onTokenPrivilegeWillExpire',
            'onTokenPrivilegeDidExpire',
            'stream-updated',
            'stopScreenSharing',
            'mute-audio',
            'unmute-audio',
            'mute-video',
            'unmute-video'
        ]

        clientEvents.forEach((eventName) => {
            this._client.on(eventName, (...args) => {
                // log event message
                this.emit(eventName, ...args)
            })
        })

        this._client.on("stream-added", (evt) => {
            const remoteStream = evt.stream;
            const id = remoteStream.getId();
            // Toast.info("stream-added uid: " + id);
            if (!this.localStreams.includes(id)) {
                this._client.subscribe(remoteStream, (err) => {
                    console.log("stream subscribe failed", err);
                })
            }
            console.log('stream-added remote-uid: ', id);
        });

        this._client.on("stream-subscribed", (evt) => {
            const remoteStream = evt.stream;
            const id = remoteStream.getId();
            this._remoteStreams.push(remoteStream);
            console.log('stream-subscribed remote-uid: ', id);
            this.emit("stream-subscribed",evt)
        })

    }

    handleEvents() {
        this._client.on("error", (err) => {
            console.log("error", err)
            console.log(err)
        })
        // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
        this._client.on("peer-leave", (evt) => {
            const id = evt.uid;
            if (id != this._params.uid) {
                removeView(id);
            }
            // Toast.notice("peer leave")
            console.log('peer-leave', id);
        })
        // Occurs when the local stream is _published.
        this._client.on("stream-published", (evt) => {
            // Toast.notice("stream published success")
            console.log("stream-published");
        })
        // Occurs when the remote stream is added.
        this._client.on("stream-added", (evt) => {
            const remoteStream = evt.stream;
            const id = remoteStream.getId();
            // Toast.info("stream-added uid: " + id);
            if (id !== this._params.uid) {
                this._client.subscribe(remoteStream, (err) => {
                    console.log("stream subscribe failed", err);
                })
            }
            console.log('stream-added remote-uid: ', id);
        });
        // Occurs when a user subscribes to a remote stream.
        this._client.on("stream-subscribed", (evt) => {
            const remoteStream = evt.stream;
            const id = remoteStream.getId();
            this._remoteStreams.push(remoteStream);
            addView(id, this._showProfile);
            remoteStream.play("remote_video_" + id, { fit: "cover" }, (err) => {
                if (err) {
                    // when status is 'pasued' need website user trigger event to play subscription stream
                    if (err.status == 'paused') {
                        $("#video_autoplay_" + id).removeClass("hide")
                    } else {
                        // Toast.error("remotestream play failed probably caused by web browser autopolicy open console see more details");
                        console.error(err);
                    }
                }
            });
            // Toast.info('stream-subscribed remote-uid: ' + id);
            console.log('stream-subscribed remote-uid: ', id);
        })
        // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
        this._client.on("stream-removed", (evt) => {
            const remoteStream = evt.stream;
            const id = remoteStream.getId();
            // Toast.info("stream-removed uid: " + id);
            remoteStream.stop();
            this._remoteStreams = this._remoteStreams.filter((stream) => {
                return stream.getId() !== id
            });
            removeView(id);
            console.log('stream-removed remote-uid: ', id);
        })
        this._client.on("onTokenPrivilegeWillExpire", () => {
            // After requesting a new token
            // this._client.renewToken(token);
            // Toast.info("onTokenPrivilegeWillExpire");
            console.log("onTokenPrivilegeWillExpire");
        });
        this._client.on("onTokenPrivilegeDidExpire", () => {
            // After requesting a new token
            // client.renewToken(token);
            // Toast.info("onTokenPrivilegeDidExpire");
            console.log("onTokenPrivilegeDidExpire");
        })
        // Occurs when stream changed
        this._client.on("stream-updated", () => {
            // Toast.info("stream-updated");
            console.log("stream-updated");
        })
    }


    _createAudienceStream(data, next) {

        const AgoraRTC = require('agora-rtc-sdk')
        this._localStream = AgoraRTC.createStream({
            streamID: this._params.uid,
            audio: true,
            video: false,
            screen: false,
            // microphoneId: data.microphoneId,
        });

        this._localStream.on("player-status-change", (evt) => {
            console.log("player status change", evt);
        })

        // init local stream
        this._localStream.init(() => {
            console.log("init local audio stream success");
            // run callback
            next();
        }, (err) => {
            // Toast.error("stream init audio failed, please open console see more detail");
            console.error("init local audio stream failed ", err);
        })
    }

    _createAudioStream(data, next) {

        const AgoraRTC = require('agora-rtc-sdk')
        this._localStream = AgoraRTC.createStream({
            streamID: this._params.uid,
            audio: true,
            video: false,
            screen: false,
            // microphoneId: data.microphoneId,
        });

        this.emit("on-init-local-stream", this._localStream)
        
        this._localStream.on("player-status-change", (evt) => {
            console.log("player status change", evt);
        })

        // init local stream
        this._localStream.init(() => {
            console.log("init local audio stream success");
            // run callback
            next();
        }, (err) => {
            // Toast.error("stream init audio failed, please open console see more detail");
            console.error("init local audio stream failed ", err);
        })
    }

    _createHostStream(data, next) {
        const AgoraRTC = require('agora-rtc-sdk')
        this._localStream = AgoraRTC.createStream({
            streamID: this._params.uid,
            audio: false,
            video: true,
            screen: false,
            // microphoneId: data.microphoneId,
            // cameraId: data.cameraId
        });

        this._localStream.on("player-status-change", (evt) => {
            console.log("player status change", evt);
        })

        if (data.cameraResolution && data.cameraResolution != 'default') {
            // set local video resolution
            this._localStream.setVideoProfile(data.cameraResolution);
        }

        // init local stream
        this._localStream.init(() => {
            console.log("init local host stream success");
            // play stream with html element id "local_stream"
            
            this._localStream.play("local_stream", { fit: "cover" }, (err) => {
                if (err) {
                    // when status is 'pasued' need website user trigger event to play subscription stream
                    if (err.status == 'pasued') {
                        $("#video_autoplay_local").removeClass("hide")
                    } else {
                        // Toast.error("local stream play failed probably caused by web browser autopolicy open console see more details");
                        console.error(err);
                    }
                }
            });

            // run callback
            next();
        }, (err) => {
            // Toast.error("stream init failed, please open console see more detail");
            console.error("init local host stream failed ", err);
        })
    }

    _createVideoStream(data, next) {
        const AgoraRTC = require('agora-rtc-sdk')
        
        this._localStream = AgoraRTC.createStream({
            streamID: this._params.uid,
            audio: true,
            video: true,
            screen: false,
            // microphoneId: data.microphoneId,
            // cameraId: data.cameraId
        });
        

        this.emit("on-init-local-stream",this._localStream)

        this._localStream.on("player-status-change", (evt) => {
            console.log("player status change", evt);
        })

        if (data.cameraResolution && data.cameraResolution != 'default') {
            // set local video resolution
            this._localStream.setVideoProfile(data.cameraResolution);
        }

        // init local stream
        this._localStream.init(() => {
            console.log("init local host stream success");
            // play stream with html element id "local_stream"
            
            this.emit("onLocalStreamInit", this._localStream)

            // run callback
            next();
        }, (err) => {
            // Toast.error("stream init failed, please open console see more detail");
            console.error("init local host stream failed ", err);
        })
    }


    _createScreenStream(data, next) {
        const AgoraRTC = require('agora-rtc-sdk')

        const streamSpec = {
            streamID: this._params.uid,
            audio: false,
            video: false,
            screen: true,
            screenAudio: true
        }

        if (isFirefox()) {
            streamSpec.mediaSource = 'screen' // 'screen', 'application', 'window'
        }

        this._localStream = AgoraRTC.createStream(streamSpec);



        this._localStream.on("player-status-change", (evt) => {
            console.log("player status change", evt);
        })

        if (data.cameraResolution && data.cameraResolution != 'default') {
            // set local video resolution
            this._localStream.setVideoProfile(data.cameraResolution);
        }

        console.log("_createScreenStream")
        // init local stream
        this._localStream.init(() => {
            console.log("init local host stream success");
            // play stream with html element id "local_stream"

            this.emit("onLocalStreamInit", this._localStream)

            // run callback
            next();
        }, (err) => {
            // Toast.error("stream init failed, please open console see more detail");
            console.error("init local host stream failed ", err);
        })
    }

    join(data) {
        return new Promise((resolve, reject) => {
            if (this._joined) {
                // Toast.error("Your already joined");
                console.log("Your already joined")
                return;
            }

            /**
             * A class defining the properties of the config parameter in the createClient method.
             * Note:
             *    Ensure that you do not leave mode and codec as empty.
             *    Ensure that you set these properties before calling Client.join.
             *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
            **/
            const AgoraRTC = require('agora-rtc-sdk')
            this._client = AgoraRTC.createClient({ mode: data.mode, codec: data.codec });
            this.emit("on-init-client",this._client)

            this._params = data;

            // handle AgoraRTC client event
            if (data.role === 'video' || data.role === 'screen' || data.role === 'audio'){
                this.subscribeClientEvents()
            }else{
                this.handleEvents();
            }
           
           

            // init client
            this._client.init(agora.APPID, () => {
                console.log("init success");

                /**
                 * Joins an AgoraRTC Channel
                 * This method joins an AgoraRTC channel.
                 * Parameters
                 * tokenOrKey: string | null
                 *    Low security requirements: Pass null as the parameter value.
                 *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
                 *  channel: string
                 *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
                 *    26 lowercase English letters a-z
                 *    26 uppercase English letters A-Z
                 *    10 numbers 0-9
                 *    Space
                 *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
                 *  uid: number | null
                 *    The user ID, an integer. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
                 *   Note:
                 *      All users in the same channel should have the same type (number) of uid.
                 *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
                **/

                console.log("data",data)
                const token = this.getToken(data.channel, data.username, data.uid) //"006af8d889e49434c15b0985d3c19d0b027IACtnMSRxRtQdJRNFSD3s6rEVujnK4m471g3DtKtAv5Czg0I1JIAAAAAEAALV6bzHsqbXgEAAQAeypte" // this.getToken(data.channel, data.username)

                console.log("Token", token)
                this._client.join(token, data.channel, data.uid, (uid) => {
                    this._params.uid = uid;
                    this.localStreams.push(uid)

                    // Toast.notice("join channel: " + data.channel + " success, uid: " + uid);
                    console.log("join channel: " + data.channel + " success, uid: " + uid);
                    this._joined = true;

                    // start stream interval stats
                    // if you don't need show stream profile you can comment this
                    // if (!this._interval) {
                    //     this._interval = setInterval(() => {
                    //         this._updateVideoInfo();
                    //     }, 0);
                    // }

                    // create local stream
                    if (data.role === 'audience') {
                        this._createAudienceStream(data, () => {
                            resolve();
                        });
                    } else if (data.role === 'video'){
                        this._createVideoStream(data, () => {
                            resolve();
                        });
                    } else if (data.role === 'audio') {
                        this._createAudioStream(data, () => {
                            resolve();
                        });
                    } else if (data.role === 'screen') {
                        this._createScreenStream(data, () => {
                            resolve();
                        });
                    } else if (data.role === 'host') {
                        this._createHostStream(data, () => {
                            resolve();
                        });
                    }

                }, function (err) {
                    // Toast.error("client join failed, please open console see more detail");
                    console.error("client join failed", err);
                })
            }, (err) => {
                // Toast.error("client init failed, please open console see more detail");
                console.error(err);
            });
        })
    }

    publish() {
        if (!this._client) {
            // Toast.error("Please Join First");
            console.log("Please Join First")
            return;
        }
        if (this._published) {
            // Toast.error("Your already published");
            console.log("Your already published")
            return;
        }
        const oldState = this._published;

        // publish localStream
        this._client.publish(this._localStream, (err) => {
            this._published = oldState;
            console.log("publish failed");
            // Toast.error("publish failed");
            console.error(err);
        });
        // Toast.info("publish");
        this._published = true;
    }

    unpublish() {
        if (!this._client) {
            // Toast.error("Please Join First");
            console.log("Please Join First")
            return;
        }
        if (!this._published) {
            // Toast.error("Your didn't publish");
            console.log("Your didn't publish")
            return;
        }
        const oldState = this._published;
        this._client.unpublish(this._localStream, (err) => {
            this._published = oldState;
            console.log("unpublish failed");
            // Toast.error("unpublish failed");
            console.error(err);
        });
        // Toast.info("unpublish");
        this._published = false;
    }

    leave() {
        if (!this._client) {
            // Toast.error("Please Join First!");
            console.log("Please Join First!")
            return;
        }
        if (!this._joined) {
            // Toast.error("You are not in channel");
            console.log("You are not in channel")
            return;
        }
        // leave channel
        this._client.leave(() => {

            // close stream
            this._localStream.close();

            // $("#local_video_info").addClass("hide");

            this.emit("onLocalLeave", this._localStream, this._remoteStreams)

            // stop stream
            this._localStream.stop();
            while (this._remoteStreams.length > 0) {
                const stream = this._remoteStreams.shift();
                const id = stream.getId();
                stream.stop();
                console.log("Stop remote stream")
                // removeView(id);
            }

            this._localStream = null;
            this._remoteStreams = [];
            this._client = null;
            console.log("client leaves channel success");
            this._published = false;
            this._joined = false;
            // Toast.notice("leave success")
        }, (err) => {
            console.log("channel leave failed");
            // Toast.error("leave success");
            console.error(err);
        })
    }

    _updateVideoInfo() {
        this._localStream && this._localStream.getStats((stats) => {
            const localStreamProfile = [
                ['Uid: ', this._localStream.getId()].join(''),
                ['SDN access delay: ', stats.accessDelay, 'ms'].join(''),
                ['Video send: ', stats.videoSendFrameRate, 'fps ', stats.videoSendResolutionWidth + 'x' + stats.videoSendResolutionHeight].join(''),
            ].join('<br/>');
            $("#local_video_info")[0].innerHTML = localStreamProfile;
        })

        if (this._remoteStreams.length > 0) {
            for (let remoteStream of this._remoteStreams) {
                remoteStream.getStats((stats) => {
                    const remoteStreamProfile = [
                        ['Uid: ', remoteStream.getId()].join(''),
                        ['SDN access delay: ', stats.accessDelay, 'ms'].join(''),
                        ['End to end delay: ', stats.endToEndDelay, 'ms'].join(''),
                        ['Video recv: ', stats.videoReceiveFrameRate, 'fps ', stats.videoReceiveResolutionWidth + 'x' + stats.videoReceiveResolutionHeight].join(''),
                    ].join('<br/>');
                    if ($("#remote_video_info_" + remoteStream.getId())[0]) {
                        $("#remote_video_info_" + remoteStream.getId())[0].innerHTML = remoteStreamProfile;
                    }
                })
            }
        }
    }

    setNetworkQualityAndStreamStats(enable) {
        this._showProfile = enable;
        this._showProfile ? $(".video-profile").removeClass("hide") : $(".video-profile").addClass("hide")
    }
}