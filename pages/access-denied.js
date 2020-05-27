import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Router from 'next/router'

function AccessDenied() {

    const [count, setCount] = useState(5)

    if (count === 0) {
        Router.push('/login')
    }

    useEffect(() => {
        if (count !== 0) {
            setTimeout(() => {
                setCount(count - 1)
            }, 1000)
        }
    }, [count])

    return (
        <div style={{ height: '100vh', paddingTop: '20vh', backgroundColor: 'rgb(248,249,252)' }}>

            <div className="row d-flex justify-content-center align-items-center m-0">
                <div className="col-md-8 bg-white rounded shadow">
                    <div className="p-5">
                        <div className="text-center">
                            <h1 className="text-danger mb-2">Access Denied.</h1>
                        </div>
                        <div className="text-center">
                            <h5 className="text-dark mb-2">Your session is expired or you don't have permission to access the requested page.</h5>
                        </div>
                        <div className="text-center">
                            <h5 className="text-dark mb-2">
                                Redirect to <Link href="/login" className="mx-1">
                                    <a>Login</a>
                                </Link> page in {count}s.
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AccessDenied
