import React from 'react'

var delaySearch = null

const HeaderRecent = (props) => {



    return (
        <div className="theme-title">
            <div className="media">
                <div>
                    <h2>Chat</h2>
                    <h4>Start New Conversation</h4>
                </div>
                <div className="media-body text-right">   <a className="icon-btn btn-outline-light btn-sm search contact-search" href="#"><i className="fas fa-search"></i></a>
                    <form className="form-inline search-form">
                        <div className="form-group">
                            <input id="recent-search" onKeyUp={(e) => {

                                const value = e.target.value
                                if (delaySearch) {
                                    clearTimeout(delaySearch)
                                }
                                delaySearch = setTimeout(() => {
                                    
                                    props.onSearchEnter(value)

                                }, 500);


                            }} className="form-control-plaintext" type="search" placeholder="Search.." />
                            <div className="icon-close close-search" onClick={() =>{
                                props.onSearchEnter("")
                            }}></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export { HeaderRecent } 