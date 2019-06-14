

export default function (state = {}, action) {
    switch (action.type) {
        case 'GET_DOCTORS_BY_CATEGORY':
            return { ...state, doctorsList: action.payload }
        case 'GET_DOCTOR_DETAILS':
            return { ...state, doctorDetails: action.payload }
        case 'GET_DOCTOR_DETAILS':
            return { ...state, doctorDetailsErr: true }
        case 'BOOKING_ERROR':
            return { ...state, bookingErr: true }
        case 'GET_USER_PENDING':
            return { ...state, pending: action.payload }
        case 'GET_USER_SUMMARY':
            return { ...state, summary: action.payload }
        case 'UPDATED_USER_SUCCESS':
            return { ...state, updatedUser: true }
        case 'CUPDATED_USER_FAILD':
            return { ...state, updatedUserFailed: true }
        case 'RESET_UPDATED_USER':
            return { ...state, updatedUser: false }
        case 'GET_SENT_REQUESTS':
            return { ...state, sentRequests: action.payload }
        case 'GET_USER_RATING':
            return { ...state, getUserRating: action.payload }
        case 'POST_USER_RATING':
            return { ...state, getUserRating: null }
        default:
            return state
    }
}