
import UAParser from 'ua-parser-js'
import moment from 'moment'
import CryptoJS from 'crypto-js'
import * as numeral from 'numeral'

export const validateEmail = (email) => {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());

}

export const validateURL = (str) => {

    var expression = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi
    var regexp = new RegExp(expression);
    return regexp.test(str);

}

export const validatePassword = (str) => {

    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
    var regexp = new RegExp(strongRegex);

    return regexp.test(str);

}
export const validateHashtag = (str) => {

    var expression = /^[A-Za-z|ก-๙|0-9]+$/
    var regexp = new RegExp(expression);
    return regexp.test(str);

}
export const validatePhone = (phone) => {
    var expression = /^([0-9|\-|(|)|\s|+]{2,4})([0-9|\-]{3,4})([0-9]{4})+$/;
    var regexp = new RegExp(expression);
    return regexp.test(phone);
}

export const validateThLetters = (str) => {
    const letters = /^[ก-๙|\n|\s|0-9|\.|,|:|/|\\||(|)|\-|+|_|&|\*|\$|\%|#|@|!|'|?|"|=|’]+$/
    return letters.test(str + '')
}

export const validateEnLetters = (str) => {
    const letters = /^[A-Za-z|\n|\s|0-9|\.|,|:|/|\\||(|)|\-|+|_|&|\*|\$|\%|#|@|!|'|?|"|=|’]+$/
    return letters.test(str + '')
}

export const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });

}

export const validateImageDimension = (images, width, height) => {

    const imageToCheck = []

    images.forEach(img => {
        if (img.imageFile) {
            imageToCheck.push(img)
        }
    })

    return Promise.all(imageToCheck.map(img => {

        return new Promise((resolve, rejects) => {

            try {

                const image = new Image()
                image.src = img.urlPreview
                image.onload = function () {

                    if (this.height == height && this.width == width) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }

            } catch (error) {

                rejects(error)

            }

        })

    }))

}

export const validateImageSize = (images, kb = 400) => {

    const imageToCheck = []

    images.forEach(img => {
        if (img.imageFile) {
            imageToCheck.push(img)
        }
    })

    return Promise.all(imageToCheck.map(img => {

        return new Promise((resolve, rejects) => {

            try {
                if (Math.floor(img.imageFile.size / 1000) < kb) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } catch (error) {
                rejects(error)
            }

        })

    }))
}

export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const validateSizeInKb = (file, limitSize) => {
    return file.size / 1024 <= limitSize
}

export const formatRoleList = (roles) => {
    const showRoles = {}
    roles.forEach(r => {
        showRoles[r.id] = r.roleName
    })
    return showRoles
}

export function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export const getImageProfile = (image) => {

    if (image && image != "") {

        return (image)
    } else {

        return ("/static/img/ic_default_user.png")
    }
}

export function isJSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

export function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) return 'n/a'
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes} ${sizes[i]})`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

export const iconFile = (filename) => {


    if (!filename || filename === "") {

        return ("far fa-file-archive")
    }

    const fileExt = filename.split('.').pop();
    if (fileExt.toLowerCase() === "zip" || fileExt.toLowerCase() === "rar" || fileExt.toLowerCase() === "tgz") {
        return ("far fa-file-archive")
    } else if (fileExt.toLowerCase() === "csv" || fileExt.toLowerCase() === "xls" || fileExt.toLowerCase() === "xlsb" || fileExt.toLowerCase() === "xlsm" || fileExt.toLowerCase() === "xlsx") {
        return ("far fa-file-excel")
    } else if (fileExt.toLowerCase() === "doc" || fileExt.toLowerCase() === "dot" || fileExt.toLowerCase() === "docx" || fileExt.toLowerCase() === "docm" || fileExt.toLowerCase() === "dotx") {
        return ("far fa-file-word")
    } else if (fileExt.toLowerCase() === "pdf") {
        return ("far fa-file-pdf")
    } else if (fileExt.toLowerCase() === "pptx" || fileExt.toLowerCase() === "pptm" || fileExt.toLowerCase() === "ppt") {
        return ("far fa-file-powerpoint")
    } else {
        return ("far fa-file-archive")
    }

}

export const parser = new UAParser()

export const userAgentInfo = parser.getResult()

export const isSafari = () => {
    return (
        userAgentInfo.browser.name === 'Safari' ||
        userAgentInfo.browser.name === 'Mobile Safari'
    )
}

export const isFirefox = () => {
    return userAgentInfo.browser.name === 'Firefox'
}


export const chatDate = (date) => {

    if (!date || date === "") {
        return date
    }

    return moment(date, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")
}

export const SocketHostChat = (token) => {

    return `${process.env.MAIN_API_ENDPOINT}chat/socket?token=${token}`
}

export const SocketHostVideo = (token) => {

    return `${process.env.MAIN_API_ENDPOINT}video-call/socket?token=${token}`
}

export const SocketHostVoice = (token) => {

    return `${process.env.MAIN_API_ENDPOINT}voice-call/socket?token=${token}`
}

export const getRequestCall = (token) => {

    console.log("Token", token)
    if (!token || token === "") {
        return ""
    }

    try {

        return JSON.parse(CryptoJS.AES.decrypt(token, 'xkdX2F5d2nD4K8N8').toString(CryptoJS.enc.Utf8))
    } catch (error) {
        console.log("Error", error)
        return ""
    }
}

export const getToknRequestCall = (token) => {

    if (!token || token === "") {
        return ""
    }

    return CryptoJS.AES.encrypt(JSON.stringify(token), 'xkdX2F5d2nD4K8N8').toString()
}

export const formatIntegerNumber = (num) => {
    return numeral(num).format('0,0')
}