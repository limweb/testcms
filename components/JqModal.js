import React, { Component } from 'react'

class JqModal extends Component {

    show() {
        const { modalId = 'default-modal' } = this.props
        $(`#${modalId}`).modal()
    }

    close() {
        const { modalId = 'default-modal' } = this.props
        $(`#${modalId}`).modal('hide')
    }

    render() {
        const { modalId = 'default-modal', isLarge } = this.props
        return (
            <div className="bootstrap-modal">
                <div className="modal fade" id={modalId} data-backdrop="static" >
                    <div className={`modal-dialog ${isLarge ? 'modal-lg' : ''}`} role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>{this.props.title}</h4>
                                {/* <button type="button" className="close" data-dismiss="modal"><span>×</span>
                                </button> */}
                            </div>
                            <div>
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export { JqModal }
