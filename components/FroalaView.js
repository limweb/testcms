import React from 'react'

function FroalaView(props) {
    return (
        <div className="fr-element fr-view bg-white" id={props.spotId}>
            <div dangerouslySetInnerHTML={{ __html: props.html }} style={{ backgroundColor: 'white', width: '400px', overflowWrap: 'break-word', padding: '0px' }} />
        </div>
    )
}

export { FroalaView }
