import React from 'react'
import Link from 'next/link'

function ExhibitorNav(props) {
    const { currentTab = "", exhibitorId = "" } = props
    const isActive = (tab) => {
        return currentTab === tab ? "active" : ""
    }
    return (
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <Link href="/exhibitor/[id]" as={`/exhibitor/${exhibitorId}`}>
                    <a className={"nav-link " + isActive("info")}>Info</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/exhibitor/[id]/virtual-booth" as={`/exhibitor/${exhibitorId}/virtual-booth`}>
                    <a className={"nav-link " + isActive("virtual-booth")}>Virtual Booth</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/exhibitor/[id]/product" as={`/exhibitor/${exhibitorId}/product`}>
                    <a className={"nav-link " + isActive("product")}>Product</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/exhibitor/[id]/account" as={`/exhibitor/${exhibitorId}/account`}>
                    <a className={"nav-link " + isActive("account")}>Staff</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/exhibitor/[id]/dashboard" as={`/exhibitor/${exhibitorId}/dashboard`}>
                    <a className={"nav-link " + isActive("dashboard")}>Dashboard</a>
                </Link>
            </li>
        </ul>
    )
}

export default ExhibitorNav
