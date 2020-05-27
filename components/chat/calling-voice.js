import React from 'react'

const CallingVoice = props =>{

    return(
        <div className="voice-content  tabto " style={{ padding: 0 }}>
            <div className="main-contaner custom-scroll active">
                <div className="audiocall2 call-modal" style={{ width: '100%', height: '100%' }}><img className="bg-img" src="../../static/chat/images/avtar/big/audiocall.jpg" alt="Avatar" />
                <div className="center-con text-center">
                    <div id="basicUsage2">00:00:00</div>
                    <div className="title2">Josephin water</div>
                    <h6>log angelina california</h6>
                    <ul>
                        <li><a className="icon-btn btn-light button-effect mute" href="#" data-tippy-content="Mute"><i className="fa fa-microphone" /></a></li>
                        <li><a className="icon-btn btn-light button-effect mute" href="#" data-tippy-content="Speaker"><i className="fa fa-volume-up" /></a></li>
                            <li><a className="icon-btn btn-danger button-effect btn-xl is-animating" href="#" data-tippy-content="Hangup" data-dismiss="modal"> <i className="fas fa-phone-slash"></i></a></li>
                        <li><a className="icon-btn btn-light button-effect" href="#" data-tippy-content="Add Call"><i data-feather="user-plus" /></a></li>
                        <li><a className="icon-btn btn-light button-effect" href="#" data-tippy-content="Pause"><i data-feather="pause" /></a></li>
                    </ul>
                </div>
            </div>
        </div>
       </div>
    )
}

export {CallingVoice}