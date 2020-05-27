import React, { useEffect } from 'react'
import ChatScript from '../../components/chat/chat-script'


const ExhibitorDetail = (props) => {


    const { currentContact} = props

    return (
        <div className="exhibitor-content  tabto active " >
            <div className="main-contaner custom-scroll active" >
                <div style={{ padding: 45 ,height:'100%'}}>
                   
                   <div className="row justify-content-center align-items-center" style={{height:'100%'}}>
                       <div className="text-center" style={{marginTop:-150}}>
                            <i className="fas fa-comments" style={{ fontSize: 150, color:'#fdeded' }}></i>
                            <h2 className="text-center display-4 mt-5 " style={{fontWeight:'bold',color:'black'}}>Welcome to THAIFEX Chat</h2>
                            <h4 className="mt-2">Chat with you customers , share photo and files fast with high quality. </h4>
                       </div>
                   </div>
                </div>

            </div>

        </div>
   
   )
}

export { ExhibitorDetail }