import React from 'react'
import Link from 'next/link'

function Breadcrumb(props) {
    const { links } = props
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {links.map((link, index) => {
                    const { label, href, active, as } = link
                    if (!active) {
                        return (
                            <Link href={href} as={ as ? as : undefined} key={index}>
                                <li className={`breadcrumb-item ${active ? 'active' : ''}`}><a href="#">{label}</a></li>
                            </Link>
                        )
                    } else {
                        return (
                            <li key={index} className={`breadcrumb-item ${active ? 'active' : ''}`}>{label}</li>
                        )
                    }
                })}
            </ol>
        </nav>
    )
}

export { Breadcrumb }
