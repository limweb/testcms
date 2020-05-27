import React from 'react'

function ProtectedLink(props) {
    const { acceptRoles = [], children, userRole } = props
    if (acceptRoles.includes(userRole)) {
        return children
    } else {
        return ''
    }
}

export { ProtectedLink }
