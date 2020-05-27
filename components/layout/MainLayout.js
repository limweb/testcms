import React, { Component } from 'react'
import Head from 'next/head'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'

export class MainLayout extends Component {

    constructor(props){
        super(props)
    }

    render() {
        const { children, ...otherProps } = this.props
        return (
            <div className="main-layout">

                <Head>
                    <title>Virtual Event CMS</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>


                <div id="wrapper">
                
                    <Sidebar {...otherProps}/>

                    <div id="content-wrapper" className="d-flex flex-column">

                        <div id="content">

                            <Navbar {...otherProps}/>

                            <div className="container-fluid">
                                {children}
                            </div>

                        </div>

                        <Footer />

                    </div>

                </div>
            </div>
        )
    }
}

export default MainLayout
