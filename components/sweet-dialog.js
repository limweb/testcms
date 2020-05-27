import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ClipLoader from "react-spinners/ClipLoader";
// import { alert } from '../utils/Constants'

const swal = withReactContent(Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-danger mr-2',
        cancelButton: 'btn btn-dark',

    },
    buttonsStyling: false
}))

const dialog = {

    showSuccessToast(title = "Save.", timer = 1500, onClose = () => {}) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer,
            timerProgressBar: true,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title,
            onClose
        })
    },

    showDialogConfirm({
        message = "",
        onClose = () => { },
        onConfirm = () => { },
        cancelButtonText = "NO",
        confirmButtonText = "YES",
        title,
    }) {
        swal.fire({
            icon: 'question',
            title,
            text: message,
            onClose,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            preConfirm: onConfirm,
            showLoaderOnConfirm: true,
            allowOutsideClick: false
        })
    },

    showDialogFail({
        message = "",
        onClose = () => { },
        showConfirmButton = true,
        confirmButtonText = "OK",
        title
    }) {
        swal.fire({
            icon: 'error',
            title,
            text: message,
            onClose,
            confirmButtonText,
            showConfirmButton,
            timer: showConfirmButton ? undefined : 1500,
            customClass: { confirmButton: 'btn btn-dark' },
            allowOutsideClick: showConfirmButton ? false : true
        })
    },

    showDialogWarning({
        message = "",
        onClose = () => { },
        showConfirmButton = true,
        confirmButtonText = "OK",
        title,
    }) {
        swal.fire({
            icon: 'warning',
            title,
            text: message,
            onClose,
            confirmButtonText,
            showConfirmButton,
            timer: showConfirmButton ? undefined : 1500,
            customClass: { confirmButton: 'btn btn-dark' },
            allowOutsideClick: showConfirmButton ? false : true
        })
    },

    showDialogInfo({
        message = "",
        onClose = () => { },
        showConfirmButton = true,
        confirmButtonText = "OK",
        title,
    }) {
        swal.fire({
            icon: 'info',
            title,
            text: message,
            onClose,
            confirmButtonText,
            showConfirmButton,
            timer: showConfirmButton ? undefined : 1500,
            customClass: { confirmButton: 'btn btn-dark' },
            allowOutsideClick: showConfirmButton ? false : true
        })
    },

    showDialogSuccess({
        message = "",
        onClose = () => { },
        showConfirmButton = true,
        confirmButtonText = "OK",
        title,
    }) {
        swal.fire({
            icon: 'success',
            title,
            text: message,
            onClose,
            confirmButtonText,
            showConfirmButton,
            timer: showConfirmButton ? undefined : 2000,
            customClass: { confirmButton: 'btn btn-dark' },
            allowOutsideClick: showConfirmButton ? false : true
        })
    },

    showModal({
        html = <div></div>,
        title = "",
        onClose = () => { },
        onConfirm = () => { },
        cancelButtonText = "Cancel",
        confirmButtonText = "OK"

    }) {
        swal.fire({
            html,
            title,
            onClose,
            preConfirm: onConfirm,
            confirmButtonText,
            cancelButtonText,
            showCancelButton: true,
            customClass: {
                confirmButton: 'btn btn-danger mr-2',
                cancelButton: 'btn btn-dark',
                popup: 'swal-wide',
            }
        })
    },

    showOriginalModal({
        html = <div></div>,
        title = "",
        onClose = () => { },
        onConfirm = () => { },
        cancelButtonText = "Cancel",
        confirmButtonText = "OK",
        showCancelButton = true,
        showConfirmButton = true
    }) {
        swal.fire({
            html,
            title,
            onClose,
            preConfirm: onConfirm,
            confirmButtonText,
            cancelButtonText,
            showCancelButton,
            showConfirmButton
        })
    },

    close() {
        swal.close()
    },

    showTextInput({
        title = "",
        cancelButtonText = "Cancel",
        confirmButtonText = "Add",
        defaultText = ""
    }) {
        return swal.fire({
            title,
            inputValue: defaultText,
            confirmButtonText,
            cancelButtonText,
            showCancelButton: true,
            input: 'text'
        })
    },

    showLoading(title = "Uploading") {
        return swal.fire({
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            html: <ClipLoader size={46} color={'red'} />,
            title,
        })
    },

    textInput({ title = "", onConfirm = () => { }, onClose = () => { } }) {
        return swal.fire({
            title,
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            preConfirm: onConfirm,
            onClose
        })
    },

    ajax({ title = "", onConfirm = () => { }, inputType = "text", message = "" }) {
        return swal.fire({
            title,
            text: message,
            input: inputType,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Look up',
            showLoaderOnConfirm: true,
            confirmButtonText: 'Submit',
            preConfirm: (text) => onConfirm(text),
            allowOutsideClick: false
        })
    }
}

export { dialog }