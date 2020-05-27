import React from 'react'
export const YOUTUBE_URL = "https://www.youtube.com/embed/"
export const BASE_URL = process.env.MAIN_API_ENDPOINT

export const HTTP_STATUS_CODE = {
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    OK: 200,
    BAD_GATEWAY: 502,
    INTERNAL_SERVER_ERROR: 500,
    CREATED: 201,
    NO_CONTENT: 204,
    NOT_MODIFIED: 304
}

export const ENV = {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development'
}

export const PRODUCT_STATUS = {
    PUBLISH: 'publish',
    UNPUBLISH: 'unpublish'
}

export const EXHIBITOR_STATUS = {
    ACTIVE: 'active',
    TRUE: 'true',
    FALSE: 'false'
}

export const PUBLISH = 'publish'
export const ACTIVE = 'active'
export const UNPUBLISH = 'unpublish'

export const messageType = {
    TEXT: 'text',
    FILE: 'file',
    IMAGE: 'image',
    VIDEO: 'video',
    STICKER: 'sticker',
    VIDEO_HISTORY: 'callhistory',
    VOICE_HISTORY: 'voicehistory'
}

export const dateFormat = {
    SERVER_CHAT: "DD-MM-YYYY DD:mm:ss",
    LOCAL_CHAT: "DD/MM/YYYY DD:mm"
}

export const agora = {
    APPID: "af8d889e49434c15b0985d3c19d0b027",//"157f0a6799e14b71b61c908b4e5d1c00",
    APP_CERTIFICATE: "1f68714d0ada41458afa37e4d6617763" //"1700098d54304fe2b64ad9637c76ea96"
}

export const stateCall = {
    CALLING: 'calling',
    REQUEST_CALL: 'request_call',
    IDLE: 'idle'
}

export const PASSWORD = (
    <ul>
        <li>The password must contain four character categories among the following:</li>
        <li>
            <ul style={{ listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>Uppercase characters (A-Z)</li>
                <li>Lowercase characters (a-z)</li>
                <li>Digits (0-9)</li>
                <li>{`Special characters (!@#$%^&*)`}</li>
            </ul>
        </li>
        <li>and must be eight characters or longer.</li>
    </ul>
)

export const ROLES = {
    SUPER_ADMIN: 'Supper admin',
    ORGANIZER: 'Organizer',
    ORGANIZER_STAFF: 'Organizer staff',
    EXHIBITOR: 'Exhibitor',
    EXHIBITOR_STAFF: 'Exhibitor staff',
}

export const ALL_ROLES = [ROLES.SUPER_ADMIN, ROLES.EXHIBITOR_STAFF, ROLES.EXHIBITOR, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF]


export const VIDEO = 'video'
export const SLIDE = 'slide'
export const BANNER = 'banner'
export const MAIN_SCREEN_TYPE = [VIDEO, BANNER]

export const ANNOUNCE_STATUS = {
    DRAFT: 'draft',
    SEND: 'send'
}