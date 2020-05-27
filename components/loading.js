import React from 'react'

const Loading = (props) => {

    return (
        <div className="justify-content-center align-items-center row">
            <div className="spinner-grow text-info align-self-center " style={{ width: '5rem', height: '5rem' }} role="status">

            </div>
            <span>Loading...</span>
        </div>
    )
}

export { Loading }