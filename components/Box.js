import React from 'react'

function Box(props) {
    return (
        <div className={"card shadow mb-4 " + props.className}>
            <div className={"card-body " + props.bodyClassName}>
                {props.children}
            </div>
        </div>
    )
}

export { Box }
