import React from 'react'
import { SocketHostChat } from '../../util/utilities'

const IncomeVoice = (props) =>{

    return(
        <div className="modal fade container-modal-income" id="audiocall" tabIndex={-1} role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-body" style={{padding:0}}>
                        <div className="audiocall1 call-modal"><img className="bg-img" src="../../static/chat/images/avtar/big/audiocall.jpg" alt="Avatar" />
                            <div className="center-con text-center">
                                <div className="title2">Josephin water</div>
                                <h6>log angelina california</h6>
                                <ul>
                                    <li><a onClick={() => {
                                        $('#audiocall').modal('hide');
                                        $('body').removeClass('modal-open');
                                        $('.modal-backdrop').remove();

                                    }} className="icon-btn btn-success button-effect btn-xl is-animating" href="#" data-toggle="modal" data-target="#audiocall" data-dismiss="modal"> <i className="fas fa-phone-alt"></i></a></li>
                                    <li><a onClick={() => {
                                        $('#audiocall').modal('hide');
                                        $('body').removeClass('modal-open');
                                        $('.modal-backdrop').remove();

                                    }} className="icon-btn btn-danger button-effect btn-xl is-animating cancelcall" href="#" data-dismiss="modal" data-target="#audiocall"> <i className="fas fa-phone-slash"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export {IncomeVoice}