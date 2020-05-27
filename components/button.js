import React from 'react'

const ButtonApp = ({ isLoading, className, children, isRounded, ...other }) => {

    return (
        <button disabled={isLoading} className={`btn  ${className || ''}`} {...other}>
            {isLoading && <div className="spinner-grow spinner-grow-sm text-warning" role="status" />}{children}
        </button>
    )
}

export { ButtonApp } 