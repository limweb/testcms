
import React  from 'react'

const MainCall = props =>{

    return(
        <div className="call-content tabto">
            <div className="row">
                <div className="col-sm-5">
                    <div className="user-profile mb-3">
                        <div className="user-content"><img className="img-fluid" src="../../static/chat/images/contact/2.jpg" alt="user-img" />
                            <h3>Josephin water</h3>
                            <h4 className="mt-2">+0 1800 76855</h4>
                            <ul>
                                <li><i className="fab fa-twitch" />massage</li>
                                <li><i className="fa fa-phone" data-toggle="modal" data-target="#audiocall" />voice call</li>
                                <li> <i className="fa fa-video-camera" data-toggle="modal" data-target="#videocall" />video call</li>
                            </ul>
                        </div>
                    </div>
                    <div className="user-profile">
                        <div className="document">
                            <div className="filter-block">
                                <div className="collapse-block open">
                                    <h5 className="block-title">Shared Document
                      <label className="badge badge-success sm ml-2">3</label>
                                    </h5>
                                    <div className="block-content">
                                        <ul className="document-list">
                                            <li><i className="ti-folder font-danger" />
                                                <h5>Simple_practice_project-zip</h5>
                                            </li>
                                            <li><i className="ti-write font-success" />
                                                <h5>Word_Map-jpg</h5>
                                            </li>
                                            <li><i className="ti-zip font-primary" />
                                                <h5>Latest_Design_portfolio.pdf</h5>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-7">
                    <div className="call-log-main custom-scroll">
                        <div className="coll-log-group">
                            <div className="log-content-left">
                                <div className="media"><i data-feather="phone-incoming" />
                                    <div className="media-body">
                                        <h5>incoming call                    </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="log-content-right">
                                <h6>15 Minutes ago 5:10 &nbsp;(22/10/19)</h6>
                            </div>
                        </div>
                        <div className="coll-log-group">
                            <div className="log-content-left">
                                <div className="media"><i data-feather="phone-incoming" />
                                    <div className="media-body">
                                        <h5>outgoing call</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="log-content-right">
                                <h6>30 Minutes ago 10:30 &nbsp;(12/09/19)</h6>
                            </div>
                        </div>
                        <div className="coll-log-group">
                            <div className="log-content-left">
                                <div className="media"><i data-feather="phone-missed" />
                                    <div className="media-body">
                                        <h5>missed call</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="log-content-right">
                                <h6>1 Minutes ago 8:30 &nbsp; (28/08/19)</h6>
                            </div>
                        </div>
                        <div className="coll-log-group">
                            <div className="log-content-left">
                                <div className="media"><i data-feather="phone-missed" />
                                    <div className="media-body">
                                        <h5>missed call</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="log-content-right">
                                <h6>10 Minutes ago 9:10 &nbsp; (18/01/19)</h6>
                            </div>
                        </div>
                        <div className="coll-log-group">
                            <div className="log-content-left">
                                <div className="media"><i data-feather="phone-missed" />
                                    <div className="media-body">
                                        <h5>missed call</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="log-content-right">
                                <h6>35 Minutes ago 9:10 &nbsp; (17/01/19)</h6>
                            </div>
                        </div>
                        <div className="coll-log-group">
                            <div className="log-content-left">
                                <div className="media"><i data-feather="phone-missed" />
                                    <div className="media-body">
                                        <h5>missed call</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="log-content-right">
                                <h6>80 Minutes ago 12:05 &nbsp; (17/01/19)</h6>
                            </div>
                        </div>
                        <div className="coll-log-group">
                            <div className="log-content-left">
                                <div className="media"><i data-feather="phone-incoming" />
                                    <div className="media-body">
                                        <h5>incoming call</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="log-content-right">
                                <h6>15 Minutes ago 15:20 &nbsp; (28/02/20)</h6>
                            </div>
                        </div>
                        <div className="coll-log-group">
                            <div className="log-content-left">
                                <div className="media"><i data-feather="phone-incoming" />
                                    <div className="media-body">
                                        <h5>incoming call</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="log-content-right">
                                <h6>10 Minutes ago 20m 26s &nbsp; 10/3/20</h6>
                            </div>
                        </div>
                    </div>
                    <div className="call-log-clear"> <i className="ti-trash font-danger" /><span className="font-danger">Delete call log</span></div>
                </div>
            </div>
        </div>

    )
}
export {MainCall}