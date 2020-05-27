import React, { Component } from 'react'
import Cookies from 'js-cookie'
import { Route, BrowserRouter, Switch, Redirect, } from 'react-router-dom'

export default class MainNavigationBar extends Component {

  constructor(props) {
    super(props)

    const account = Cookies.getJSON('account')

    this.state = {
      account: { ...account }
    }
  }

  render() {

    const { account } = this.state

    if (!Cookies.getJSON('account') || Cookies.getJSON('account') === "") {
      return <Redirect
        to={{
          pathname: "/login"
        }}
      />
    }

    return (
      <nav className="navbar navbar-dark  sticky-top bg-navbar">
        <a className="navbar-brand" href="#">e-Meeting</a>
        <div className="dropdown ">
          <div role="button" type="button" className="btn dropdown " data-toggle="dropdown">
            <div className="align-items-center justify-content-center row">
              <i className="fas fa-user-circle fa-2x text-white"></i>
              <label className="text-white ml-2">{account && account.fullName}</label>
            </div>
           
          </div>
          <div className="dropdown-menu" aria-labelledby="dropdownMenu">
            <button className="dropdown-item" type="button" onClick={() =>{
              Cookies.set("account","")
              this.setState({})

            }}>ออกจากระบบ <i className="fas fa-sign-out-alt"></i></button>
          </div>
        </div>

      </nav>
    )
  }
}
