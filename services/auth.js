import React from 'react'
import api, { showErrorDialog } from './webservice'
import cookie from "js-cookie"
import nextCookie from 'next-cookies'
import Router from 'next/router'
import { runScript } from '../util/script'
import { dialog } from '../components'
import { ROLES } from '../util/constants'

export function getRootRoute(accountData) {
    const { accountID, roleName } = accountData
    if (roleName === ROLES.EXHIBITOR_STAFF) {
        return `/chat`
    } else if (roleName === ROLES.EXHIBITOR) {
        return `/exhibitor/${accountID}`
    } else if (roleName === ROLES.ORGANIZER_STAFF) {
        return `/war-room`
    } else {
        return '/dashboard'
    }
}

export function login({ email, password }) {
    return api.login({ email, password }).then(res => {
        const token = res.data.result.token
        const accountData = res.data.result
        if (accountData.roleName === ROLES.EXHIBITOR_STAFF) {
            api.saveVisitStatistic({ type: 'Staff', exhibitorStaffID: accountData.accountID })
        }
        cookie.set("token", token, { expires: 1 })
        cookie.set("misc", accountData, { expires: 1 })
        return getRootRoute(accountData)
    })
}

export function setNewToken(token) {
    cookie.set("token", token, { expires: 1 })
}

export function setNewAccountData(data) {
    cookie.set("misc", data, { expires: 1 })
}

export function clearCookie() {
    cookie.remove("token")
    cookie.remove("misc")
}

export function logout() {
    return api.logout().then(() => {
        cookie.remove("token");
        cookie.remove("misc");
    })
}

export const checkAccount = () => {
    if (userAccount() && tokenAccount()) {
        return true
    } else {
        return false
    }
}

export const userAccount = () => {
    return cookie.getJSON("misc")
}

export const tokenAccount = () => {
    return cookie.get("token")
}


export function withAuth(WrappedComponent, roles) {
    return class ProtectedComponent extends React.Component {

        static displayName = `withAuth(${getDisplayName(WrappedComponent)})`

        static async getInitialProps(ctx) {

            const { token, account } = getAuth(ctx)
            checkAuth(token, account, roles, ctx)

            const componentProps =
                WrappedComponent.getInitialProps &&
                (await WrappedComponent.getInitialProps(ctx))

            return { ...componentProps, token, account }

        }

        componentDidMount() {
            const { error } = this.props
            if (error && error.response && (error.response.status === HTTP_STATUS_CODE.UNAUTHORIZED || error.response.status === HTTP_STATUS_CODE.FORBIDDEN)) {
                clearCookie()
                Router.replace('/login').then(() => {
                    dialog.showDialogFail({
                        title: "Access Denied.",
                        message: "Your session is expired or you don't have permission to access the requested page.",
                        confirmButtonText: "Click here to login."
                    })
                })
            } else if (error) {
                console.log('init errors: ', error);
                showErrorDialog(error)
            }

            runScript()

        }

        render() {
            return <WrappedComponent {...this.props} />
        }

    }
}

function getDisplayName(Component) {
    return Component.displayName || Component.name || 'Component'
}

export function getAuth(context) {
    const { token, misc } = nextCookie(context)
    return { token, account: misc }
}

function checkAuth(token, account, roles = [], ctx) {
    if (ctx.req && !token) {
        ctx.res.writeHead(302, { Location: '/login' })
        ctx.res.end()
    } else if (ctx.req && token) {
        if (!roles.includes(account.roleName)) {
            ctx.res.writeHead(302, { Location: '/access-denied' })
            ctx.res.end()
        }
    }
}
