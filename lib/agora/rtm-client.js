import {agora} from '../../util/constants'
import EventEmitter from 'events'

const RtmTokenBuilder = require('./token/RtmTokenBuilder').RtmTokenBuilder;
const RtmRole = require('./token/RtmTokenBuilder').Role;
const Priviledges = require('./token/AccessToken').priviledges;



export default class RTMClient extends EventEmitter {
    constructor() {
        super()
        this.channels = {}
        this._logined = false
    }

    init() {

        const  AgoraRTM =  require('agora-rtm-sdk')

        this.client = AgoraRTM.createInstance(agora.APPID)
        this.subscribeClientEvents()
    }

    getToken(account){

        const expirationTimeInSeconds = 3600
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
        
        const token = RtmTokenBuilder.buildToken(agora.APPID, agora.APP_CERTIFICATE, account, RtmRole, privilegeExpiredTs);

        return token
    }

    // subscribe client events
    subscribeClientEvents() {
        const clientEvents = [
            'ConnectionStateChanged',
            'MessageFromPeer'
        ]
        clientEvents.forEach((eventName) => {
            this.client.on(eventName, (...args) => {
                console.log('emit ', eventName, ...args)
                // log event message
                this.emit(eventName, ...args)
            })
        })
    }

    // subscribe channel events
    subscribeChannelEvents(channelName) {
        const channelEvents = [
            'ChannelMessage',
            'MemberJoined',
            'MemberLeft'
        ]
        channelEvents.forEach((eventName) => {
            this.channels[channelName].channel.on(eventName, (...args) => {
                console.log('emit ', eventName, args)
                this.emit(eventName, { channelName, args: args })
            })
        })
    }

    async login(accountName) {
        const token = this.getToken(accountName)
        this.accountName = accountName
        return this.client.login({ uid: this.accountName, token })
    }

    async logout() {
        return this.client.logout()
    }

    async joinChannel(name) {
        console.log('joinChannel', name)
        const channel = this.client.createChannel(name)
        this.channels[name] = {
            channel,
            joined: false // channel state
        }
        this.subscribeChannelEvents(name)
        return channel.join()
    }

    async leaveChannel(name) {
        console.log('leaveChannel', name)
        if (!this.channels[name] ||
            (this.channels[name] &&
                !this.channels[name].joined)) return
        return this.channels[name].channel.leave()
    }

    async sendChannelMessage(text, channelName) {
        console.log('sendChannelMessage', text, channelName)
        if (!this.channels[channelName] || !this.channels[channelName].joined) return
        return this.channels[channelName].channel.sendMessage({ text })
    }

    async sendPeerMessage(text, peerId) {
        console.log('sendPeerMessage', text, peerId)
        return this.client.sendMessageToPeer({ text }, peerId.toString(), { enableHistoricalMessaging:true})
    }

    async queryPeerOnlineStatus(memberId) {
        console.log('queryPeersOnlineStatus', memberId)
        return this.client.queryPeersOnlineStatus([memberId])
    }

    async queryPeersOnlineStatus(memberIdList) {
        
        return this.client.queryPeersOnlineStatus(memberIdList)
    }
}
