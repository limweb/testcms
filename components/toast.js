import React, { useEffect } from 'react'
import { ToastProvider, withToastManager, useToasts } from 'react-toast-notifications'

const Toast = withToastManager((props) => {


    useEffect(() => {
        props.toast(toast)
    })

    function toast(title, message, type) {

        const content = (
            <div>
                <strong>{title}</strong>
                <div>
                    {message}
                </div>
            </div>
        );
        props.toastManager.add(content, {
            placement: 'top-right',
            appearance: type,
            autoDismiss: true,
        }, () => { });

    }

    return <div />
})

export { Toast }