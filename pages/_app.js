import App from 'next/app'
import NextNprogress from 'nextjs-progressbar';
import React, { useEffect } from 'react'
// import SocketClient from 'socket.io-client';
import { IncomeVideo } from '../components/chat'
import { ToastProvider, useToasts } from 'react-toast-notifications'
import * as firebase from 'firebase';
import Firebase from '../services/firebase'
import api from '../services/webservice';
import { checkAccount } from '../services/auth';


function MyApp({ Component, pageProps }) {

    const sendTokenToServer = (token) => {
        api.updateFcmToken({ token })
        api.subscribeTopic({ topic: 'VIRTUAL_EVENT', token })
    }

    const initFCM = () => {
        var messaging = Firebase.messaging();
        messaging.requestPermission().then(response => {
            messaging.getToken().then((currentToken) => {
                if (currentToken) {

                    if (checkAccount()) {
                        sendTokenToServer(currentToken)
                        console.log('You logged in.');
                    } else {
                        console.log('You are not logging in.');
                    }

                } else {
                    // Show permission request.
                    console.log('No Instance ID token available. Request permission to generate one.');
                    // Show permission UI.

                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
            });
        }).catch(error => {
            console.log("error", error)
        })
        messaging.onMessage((payload) => {
            console.log('Message received. ', payload);
        });

    }

    useEffect(() => {
        Firebase.analytics();
        if (firebase.messaging.isSupported()) {
            initFCM()
        }
    }, [])


    return (
        <ToastProvider placement="top-right" autoDismissTimeout={6000}>
            <NextNprogress color={'#f00'} options={{ showSpinner: false }} />
            <Component {...pageProps} />
            <IncomeVideo />
        </ToastProvider>
    )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
MyApp.getInitialProps = async (appContext) => {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);

    return { ...appProps }
}

export default MyApp