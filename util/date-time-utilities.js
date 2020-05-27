import moment from 'moment'

export function formatDate(dateString) {
    const formatted = moment(dateString, 'DD-MM-YYYY').format('DD/MM/YYYY')
    if (formatted.toString() === 'Invalid date') {
        return ''
    } else {
        return formatted
    }

}

export function formatDateTime(dateString) {
    const formatted = moment(dateString, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss')
    if (formatted.toString() === 'Invalid date') {
        return ''
    } else {
        return formatted
    }

}

export function formatDateRangeObject(obj) {
    if (obj.startDate && obj.endDate) {
        return {
            startDate: moment(obj.startDate).format('DD-MM-YYYY'),
            endDate: moment(obj.endDate).format('DD-MM-YYYY')
        }
    } else {
        return {
            startDate: '',
            endDate: ''
        }
    }
}