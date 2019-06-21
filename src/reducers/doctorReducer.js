
export default function (state = {}, action) {
    switch (action.type) {
        case 'MAP_LOC': {
            return { ...state, clinickLoc: action.clinickLoc }
        }
        case 'RMV_MAP_LOC': {
            return { ...state, clinickLoc: null }
        }
        case "CREATED_NEW_DOCTOR": {
            return { ...state, isDoctor: true, drData: action.payload, accepted: action.accepted }
        }
        case 'CREATEING_NEW_DOCTOR_FAILD': {
            return { ...state, error: true }
        }
        case 'REMOVE_ERROR': {
            return { ...state, error: false }
        }
        case 'GET_DOCTOR_DATA': {
            return { ...state, doctorData: action.payload }
        }
        case 'GET_REQUESTS': {
            return { ...state, requests: action.payload }
        }
        case 'GET_PENDING': {
            return { ...state, pending: action.payload }
        }
        case 'GET_SUMMARY': {
            return { ...state, summary: action.payload }
        }
        case 'UPDATED_PROFILE': {
            return { ...state, updated: true }
        }
        case 'REMOVE_UPDATED_PROP': {
            return { ...state, updated: false }
        }
        default: return state
    }
}