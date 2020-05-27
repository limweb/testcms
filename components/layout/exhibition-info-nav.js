import React from 'react'
import Link from 'next/link'

function ExhibitionInfoNav(props) {
    const { currentTab = "" } = props
    const isActive = (tab) => {
        return currentTab === tab ? "active" : ""
    }
    return (
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <Link href="/fair-information">
                    <a className={"nav-link " + isActive("info")}>Info</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/fair-information/e-directory">
                    <a className={"nav-link " + isActive("e-directory")}>E-Directory</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/fair-information/cover">
                    <a className={"nav-link " + isActive("cover")}>Cover</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/fair-information/banner-gallery">
                    <a className={"nav-link " + isActive("banner-gallery")}>Banner Gallery</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/fair-information/video-banner">
                    <a className={"nav-link " + isActive("video-banner")}>Video Banner</a>
                </Link>
            </li>
        </ul>
    )
}

export default ExhibitionInfoNav
