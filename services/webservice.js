import * as http from './http'
import nextCookie from 'next-cookies'
import cookie from "js-cookie"
import { dialog } from '../components'
import { HTTP_STATUS_CODE } from '../util/constants'
import Router from 'next/router'
import { clearCookie } from './auth'


const api = {

    ADD_CONTACT: 'contact/cms/create',
    INIT_MESSAGE: 'contact/cms/create/chat',
    GET_CONTACT_BY_EXHIBITOR: 'contact/cms/list/byexhibitor',
    GET_CONTACT: 'contact/cms/list',
    SEND_MESSAGE: 'contact/cms/send-messages',
    READ_MESSAGE: 'contact/cms/read-messages',
    RECENT_CHAT: 'contact/cms/recent/list',
    RECENT_BY_ID: 'contact/cms/recent/byid',
    HISTORY_CHAT: 'contact/cms/messages',
    UPLOAD_FILE_CHAT: 'aws-file/upload/file/chat/',
    UNSEND_MESSAGE: 'contact/cms/unsend-messages',
    CALL_LIST: 'contact/cms/recent/list/call',
    SET_STATUS: 'status-online/cms',
    GET_PROFILE: 'account/cms/profile',

    login(params) {
        return post({
            params,
            path: 'authen/cms/login'
        })
    },

    logout() {
        return post({ path: 'authen/cms/logout' })
    },

    editProfile(params) {
        return put({
            path: 'account/cms/edit/profile',
            params
        })
    },

    changePassword(params) {
        return put({
            path: 'account/cms/change/password',
            params
        })
    },

    getAccount(params, context) {
        return post({
            params, context,
            path: 'account/cms/list'
        })
    },

    getAccountDetail(params, context) { //accountID
        return post({
            params,
            context,
            path: 'account/cms/detail'
        })
    },

    createAccount(params) {
        return post({
            params,
            path: 'account/cms/create'
        })
    },

    getAccountRole(context) {
        return get({
            path: 'utility/cms/accesscontrols/select',
            context
        })
    },

    getAllRole(context) {
        return get({
            path: 'utility/cms/accesscontrols',
            context
        })
    },

    editAccount(params) {
        return put({
            params,
            path: 'account/cms/edit'
        })
    },

    deleteAccount(params) {
        return deletes({
            params,
            path: 'account/cms/remove'
        })
    },

    sendInvite(params) {
        return put({
            params,
            path: 'account/cms/resend/mailinvite'
        })
    },

    createPassword(params) {
        return post({
            params,
            path: 'account/cms/invite/register'
        })
    },

    resetPassword(params) {
        return put({
            params,
            path: 'account/cms/forgotpassword'
        })
    },

    sendForgotPassword(params) {
        return post({
            params,
            path: 'account/cms/request/forgotpassword'
        })
    },

    editFairInfo(params) {
        return put({
            params,
            path: 'exhibition/cms/info'
        })
    },

    getFairInfo(context) {
        return post({
            path: 'exhibition/cms/info',
            context
        })
    },

    editEDirectory(params) {
        return put({
            path: 'exhibition/cms/e-directory',
            params
        })
    },

    deleteEDirectory(params) {
        return deletes({
            path: 'exhibition/cms/e-directory',
            params
        })
    },

    getEdirectory(context) {
        return post({
            path: 'exhibition/cms/e-directory',
            context
        })
    },

    editFairCover(params) {
        return put({
            path: 'exhibition/cms/cover',
            params
        })
    },

    getFairCover(context) {
        return post({
            path: 'exhibition/cms/cover',
            context
        })
    },

    editVideoBanner(params) {
        return put({
            path: 'exhibition/cms/video-banner',
            params
        })
    },

    getVideoBanner(context) {
        return post({
            path: 'exhibition/cms/video-banner',
            context
        })
    },

    editImageGallery(params) {
        return put({
            path: 'exhibition/cms/image-gallery',
            params
        })
    },

    getImageGallery(context) {
        return post({
            path: 'exhibition/cms/image-gallery',
            context
        })
    },

    deleteImageGallery(params) {
        return deletes({
            params,
            path: 'exhibition/cms/image-gallery'
        })
    },

    getAllExhibitors(context) {
        return get({
            path: 'utility/exhibitor/list',
            context
        })
    },

    getExhibitors(params, context) {
        return post({
            params,
            path: 'exhibitor/cms/list',
            context
        })
    },

    getExhibitorDetail(params, context) {
        return post({
            params,
            path: 'exhibitor/cms/info',
            context
        })
    },

    uploadImage(file) {
        const params = new FormData()
        params.append('image', file)
        return post({
            params,
            path: 'aws-file/upload/image',
            isMultipart: true
        })
    },

    uploadPDFs(files) {
        const params = new FormData()
        files.forEach(file => {
            params.append('pdf', file)
        })
        return post({
            params,
            path: 'aws-file/upload/pdf',
            isMultipart: true,
        })
    },

    deleteFile(params) {
        return deletes({
            params,
            path: 'aws-file/remove/file'
        })
    },

    getStaff(params, context) {
        return post({
            params,
            path: 'exhibitor-staff/list',
            context
        })
    },

    getStaffDetail(params, context) {
        return post({
            params,
            path: 'exhibitor-staff/detail',
            context
        })
    },

    deleteStaff(params) {
        return deletes({
            params,
            path: 'exhibitor-staff/remove'
        })
    },

    createStaff(params) {
        return post({
            params,
            path: 'exhibitor-staff/create'
        })
    },

    editStaff(params) {
        return put({
            params,
            path: 'exhibitor-staff/edit'
        })
    },

    sendInviteStaff(params) {
        return put({
            params,
            path: 'exhibitor-staff/resend/mailinvite'
        })
    },

    sendStaffOTP(params) {
        return post({
            params,
            path: 'otp/changemail-staff/send'
        })
    },

    checkStaffOTP(params) {
        return post({
            params,
            path: 'otp/changemail-staff/verify'
        })
    },

    changeStaffEmail(params) {
        return post({
            params,
            path: 'exhibitor-staff/change-email'
        })
    },

    createCampaign(params) {
        return post({
            params,
            path: 'campaign/cms/create',
        })
    },

    getCampaigns(params, context) {
        return post({
            params,
            context,
            path: "campaign/cms/list"
        })
    },

    getCampaignDetail(params, context) {
        return post({
            params,
            context,
            path: "campaign/cms/detail"
        })
    },

    editCampaign(params) {
        return put({
            params,
            path: "campaign/cms/update"
        })
    },

    deleteCampaign(params) {
        return deletes({
            params,
            path: "campaign/cms/delete"
        })
    },

    getFloorPlans(params, context) {
        return post({
            params,
            path: 'floor-plan/cms/list',
            context
        })
    },

    getFloorPlanDetail(params, context) {
        return post({
            params,
            path: 'floor-plan/cms/detail',
            context
        })
    },

    createFloorPlan(params) {
        return post({
            params,
            path: 'floor-plan/cms/create'
        })
    },

    editFloorPlan(params) {
        return put({
            params,
            path: 'floor-plan/cms/update'
        })
    },

    addExhibitorToFloor(params) {
        return post({
            params,
            path: 'floor-plan/cms/create/location'
        })
    },

    editExhibitorOfFloor(params) {
        return put({
            params,
            path: 'floor-plan/cms/update/location'
        })
    },

    removeExhibitorFromFloor(params) {
        return deletes({
            params,
            path: 'floor-plan/cms/delete/location'
        })
    },

    deleteFloorPlan(params) {
        return deletes({
            params,
            path: 'floor-plan/cms/delete'
        })
    },

    getRestExhibitors(params, context) {
        return post({
            params,
            path: 'floor-plan/cms/exhibitor/select',
            context
        })
    },

    getSpeakers(params, context) {
        return post({
            params,
            path: '',
            context
        })
    },

    getSpeakerDetail(params, context) {
        return post({
            params,
            path: '',
            context
        })
    },

    deleteSpeaker(params) {
        return deletes({
            params,
            path: ''
        })
    },

    createSpeaker(params) {
        return post({
            params,
            path: ''
        })
    },

    editSpeaker(params) {
        return put({
            params,
            path: ''
        })
    },

    getProductLimit(params, context) {
        return get({
            params,
            path: "utility/cms/exhibitor/limit",
            context
        })
    },

    getProductCategory(context) {
        return get({
            context,
            path: "utility/categorie"
        })
    },

    getBusinessType(params, context) {
        return get({
            params,
            path: 'utility/cms/business-type',
            context
        })
    },

    getProducts(params, context) {
        return post({
            params,
            context,
            path: 'product/cms/list',
        })
    },

    getProductDetail(params, context) {
        return post({
            path: 'product/cms',
            params,
            context
        })
    },

    createProduct(params) {
        return post({
            path: 'product/cms/create',
            params
        })
    },

    editProductInfo(params) {
        return put({
            path: 'product/cms/info',
            params
        })
    },

    upload360Image(file, productID) {
        const params = new FormData()
        params.append('image', file)
        return post({
            params,
            path: `aws-file/upload/image/product360/${productID}`
        })
    },

    editProductGallery(params) {
        return put({
            params,
            path: 'product/cms/image-gallery'
        })
    },

    editProductCertificate(params) {
        return put({
            params,
            path: 'product/cms/certificate'
        })
    },

    editProduct360Image(params) {
        return put({
            params,
            path: 'product/cms/image-360'
        })
    },

    editProductStatus(params) {
        return put({
            params,
            path: 'product/cms/change-status'
        })
    },

    deleteProduct(params) {
        return deletes({
            params,
            path: 'product/cms/remove'
        })
    },

    uploadPanoramaImage(file, exhibitorID) {
        const params = new FormData()
        params.append('image', file)
        return post({
            params,
            path: `aws-file/upload/image/booth/${exhibitorID}`
        })
    },

    savePanorama(params) {
        return post({
            params,
            path: 'booth/cms/image-panorama'
        })
    },

    getPanorama(params, context) {
        return post({
            params,
            context,
            path: 'booth/cms/list'
        })
    },

    getPanoramaList(params, context) {
        return post({
            params,
            context,
            path: 'booth/web/panorama-list'
        })
    },

    getPanoramaDetail(params, context) {
        return post({
            params,
            path: 'booth/cms/detail',
            context
        })
    },

    saveInfoSpot(params) {
        return put({
            params,
            path: 'booth/cms/info-spots'
        })
    },

    saveLinkSpot(params) {
        return put({
            params,
            path: 'booth/cms/link-spots'
        })
    },

    saveStartSpot(params) {
        return put({
            params,
            path: 'booth/cms/start-spots'
        })
    },

    savePanoramaOrder(params) {
        return put({
            params,
            path: 'booth/cms/change-sequence'
        })
    },

    deleteInfoSpot(params) {
        return deletes({
            params,
            path: 'booth/cms/info-spots'
        })
    },

    deleteLinkSpot(params) {
        return deletes({
            params,
            path: 'booth/cms/link-spots'
        })
    },

    deleteStartSpot(params) {
        return deletes({
            params,
            path: ''
        })
    },

    getPanoramaForLink(params, context) {
        return post({
            params,
            path: 'booth/cms/panorama-link',
            context
        })
    },

    deletePanorama(params) {
        return deletes({
            params,
            path: 'booth/cms/image-panorama'
        })
    },

    getCountry(context) {
        return get({
            path: 'utility/country',
            context
        })
    },

    updateFcmToken(params) {
        return put({
            path: 'account/cms/token-fcm',
            params
        })
    },

    subscribeTopic(params) {
        return post({
            params,
            path: 'notification/subscribe/topic'
        })
    },

    unsubscribeTopic(params) {
        return post({
            params,
            path: 'notification/unsubscribe/topic'
        })
    },

    getAnnouncements(params, context) {
        return post({
            params,
            context,
            path: 'war-room/cms/announcement/list'
        })
    },

    getAnnouncementDetail(params, context) {
        return post({
            params,
            context,
            path: 'war-room/cms/announcement/detail'
        })
    },

    deleteAnnouncement(params) {
        return deletes({
            params,
            path: 'war-room/cms/announcement'
        })
    },

    createAnnouncement(params) {
        return post({
            params,
            path: 'war-room/cms/announcement'
        })
    },

    publishAnnouncement(params) {
        return post({
            params,
            path: 'war-room/cms/send/announcement'
        })
    },

    editAnnouncement(params) {
        return put({
            params,
            path: 'war-room/cms/announcement'
        })
    },

    publishCampaigns(params) {
        return put({
            params,
            path: 'war-room/cms/campaign'
        })
    },

    getAllCampaign(context) {
        return get({
            context,
            path: 'war-room/cms/campaign/select'
        })
    },

    getPublishedCampaign(context) {
        return post({
            context,
            path: 'war-room/cms/campaign'
        })
    },

    getMainScreen(context) {
        return post({
            context,
            path: 'war-room/cms/main-screen'
        })
    },

    editMainScreen(params) {
        return put({
            params,
            path: 'war-room/cms/main-screen'
        })
    },

    getTotal(ctx) {
        return post({
            context: ctx,
            path: 'dashboard/organizer/total-visit'
        })
    },

    getOriginVisitor(params, ctx) {
        return post({
            params,
            context: ctx,
            path: 'dashboard/organizer/origin/visitor'
        })
    },

    getOriginExhibitor(params, context) {
        return post({
            context,
            path: 'dashboard/organizer/origin/exhibitor',
            params
        })
    },

    getTopVisitorByCountry(params, context) {
        return post({
            params,
            path: 'dashboard/organizer/top-visitor/country',
            context
        })
    },

    getTotalVisitorByBooth(params, context) {
        return post({
            params,
            path: 'dashboard/organizer/total-visit-booth',
            context
        })
    },

    getVisitorByHall(params, context) {
        return post({
            params,
            path: 'dashboard/organizer/visitor/hall',
            context
        })
    },

    getUniqueBusinessFunction(params, context) {
        return post({
            params,
            path: 'dashboard/organizer/business-function/unique',
            context
        })
    },

    getUniqueProductSourcing(params, context) {
        return post({
            params,
            path: 'dashboard/organizer/product/sourcing',
            context
        })
    },

    saveVisitStatistic(params) {
        return post({
            params,
            path: 'statistic/cms/visit'
        })
    },

    getTopVisitedBooth(params, context) {
        return post({
            params,
            path: 'dashboard/organizer/visited-booth',
            context
        })
    },

    getTopVisitedContact(params, context) {
        return post({
            params,
            path: 'dashboard/organizer/visited-contact',
            context
        })
    },

    getTopVisitedProduct(params, context) {
        return post({
            params,
            path: 'dashboard/organizer/visited-products',
            context
        })
    },

    getVisitorList(params, context){
        return post({
            params,
            path:'dashboard/organizer/visitor-detail',
            context
        })
    },

    getPorductSourcing(params, context){
        return post({
            params: { ...params, subdomain:'thf20v', questionID:'36'},
            path:'https://register.eventpass.co/api/report/question_products',
            context
        })
    },

    getQuestionReport(params, context){
        return post({
            params,
            path:'https://register.eventpass.co/api/report/question',
            context
        })
    },

    
}

function getToken(context) {
    let token = ""
    if (context) {
        ({ token } = nextCookie(context))
    } else {
        token = cookie.get("token")
    }
    return token
}

function post({ path, params, isShowError = true, isMultipart = false, config = {}, context }) {

    return new Promise((resolve, reject) => {
        return http.post(path, params, getToken(context), isMultipart, config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {

                if (isShowError) {
                    handleError(error, reject);
                } else {
                    reject(error);
                }

            });
    });
}


function put({ path, params, isShowError = true, isMultipart = false, config = {}, context }) {


    return new Promise((resolve, reject) => {
        return http.put(path, params, getToken(context), isMultipart, config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {

                if (isShowError) {
                    handleError(error, reject);
                } else {
                    reject(error);
                }

            });
    });
}

function deletes({ path, params, isShowError = true, isMultipart = false, config = {}, context }) {

    return new Promise((resolve, reject) => {
        return http.deletes(path, params, getToken(context), isMultipart, config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {

                if (isShowError) {
                    handleError(error, reject);
                } else {
                    reject(error);
                }

            });
    });
}

function get({ path, params, isShowError = true, config = {}, context }) {


    return new Promise((resolve, reject) => {
        return http.get(path, params, getToken(context), config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {

                if (isShowError) {
                    handleError(error, reject);
                } else {
                    reject(error);
                }
            });
    });
}

function handleError(error, reject) {

    if (typeof document !== 'undefined') {
        if (error.response && (error.response.status === HTTP_STATUS_CODE.UNAUTHORIZED || error.response.status === HTTP_STATUS_CODE.FORBIDDEN)) {
            clearCookie()
            Router.replace('/login').then(() => {
                dialog.showDialogFail({
                    title: "Access Denied.",
                    message: "Your session is expired or you don't have permission to access the requested page.",
                    confirmButtonText: "Click here to login."
                })
            })
        } else {
            showErrorDialog(error)
        }
    } else {
        reject(error)
    }

}

function handelUploadProgress(progressEvent) {
    const bar = document.getElementById('upload-progress-bar')
    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    bar.style.width = percentCompleted + '%'
}

function resetUploadProgressBar() {
    const bar = document.getElementById('upload-progress-bar')
    bar.style.width = '0%'
}

export function showErrorDialog(error) {
    const message = error.response && typeof error.response.data.message === 'string' ? error.response.data.message : error.message
    if (error.response && error.response.data.statusCode && error.response.data.statusCode === HTTP_STATUS_CODE.BAD_REQUEST) {
        dialog.showDialogWarning({ message })
    } else {
        dialog.showDialogFail({ message })
    }
}


export default api