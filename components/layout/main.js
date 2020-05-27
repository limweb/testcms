import React, { Component } from 'react'
import MainNavigationBar from './main-nav'
import {
    Link,
    NavLink
} from "react-router-dom";
import Cookies from 'js-cookie'
import {roles} from '../../utils/Constants'

export default class Main extends Component {

    constructor(props){
        super(props)

    }

    render() {

        const account = Cookies.getJSON('account')

        return (
            <div>
                <MainNavigationBar />
                <div style={{display:'flex'}}>
                    <div style={{ width: 250 }} className="side-nav card container-left-menu" id="seide-bar">
                        <div className="mt-3" />

                        <ul className="left-menu">

                            {(account && account.role === roles.ETR) && <li> <NavLink to="/committee" activeClassName={`active`} strict className="text-item-menu d-flex p-3 pl-5 item-left-menu align-items-center " >
                                <i className="fas fa-user col-2"></i> <span className="col-10"> ข้อมูลกรรมการ</span>
                            </NavLink>
                            </li>}
                            {(account && account.role === roles.ETR) && <li > <NavLink to="/group" activeClassName={`active`} strict className="text-item-menu p-3 pl-5 d-flex item-left-menu align-items-center " >
                                <i className="fas fa-users col-2"></i> <span className="col-10"> ข้อมูลคณะ</span>
                            </NavLink></li>}
                            
                            
                          

                            {(account && account.role === roles.SCT) && <li > <NavLink to="/meeting" activeClassName={`active`} strict className="text-item-menu d-flex p-3 pl-5 item-left-menu align-items-center " >
                                <i className="fas fa-file-invoice col-2"></i><span className="col-10"> ข้อมูลการประชุม</span>
                            </NavLink></li>}
                           
                            {(account && account.role === roles.ETR) && <li > <NavLink to="/pay" activeClassName={`active`} strict className="text-item-menu d-flex p-3 pl-5 item-left-menu align-items-center " >
                                <i className="fas fa-money-bill col-2"></i><span className="col-10"> ข้อมูลเตรียมจ่าย</span>
                            </NavLink></li>}
                           
                            
                        </ul>


                       
                       



                    </div>

                    <div style={{flex:1}}>
                        <div  style={{ paddingLeft: 250 }}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
