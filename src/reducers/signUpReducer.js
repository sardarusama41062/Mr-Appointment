// const initialState = {
//     user: null,
//     message: '',
//     phoneNumber: '',
//     confirmResult: null,
//     indicator: false,
//     error: false,
//     userExist: null,
//     newUser: null,
//     create_new_user: false,
//     create_new_user_failed: false
// };

export default function (state = {}, action) {
    switch (action.type) {
        case "RESTORE_SESSION": {
            return { ...state, user: action.payload }
        }
        case "SIGN_OUT": {
            return {
                ...state, user: null, confirmResult: null,
            }
        }
        case "INDICATOR": {
            return { ...state, indicator: true }
        }
        case "DISABLE_INDICATOR": {
            return { ...state, indicator: false }
        }
        case "CANCLE_CONFIRM_RESULT": {
            return {
                ...state,
                user: action.payload,
                confirmResult: false,
                indicator: false,
            }
        }
        case "SIGN_IN_WITH_PHONE": {
            return { ...state, confirmResult: action.payload, phoneNumber: action.phoneNumber }
        }
        case "INVALID_PHONE_NUMBER": {
            return { ...state, invalid_phoneno: 'Invalid Phone Number', indicator: false }
        }
        case "FIREBSE_USER_EXIST": {
            return { ...state, userExist: action.payload }
        }
        case "FIREBSE_USER_NOT_EXIST": {
            return { ...state, userExist: null }
        }
        case "CONFIRM_CODE_SUCCESS": {
            return { ...state, user: action.payload }
        }
        case "INVALID_CODE": {
            return { ...state, invalid_code: 'Incorrect Code', indicator: false }
        }
        case "CREATED_NEW_USER": {
            return { ...state, create_new_user: true }
        }
        case "CREATEING_NEW_USER_FAILD": {
            return { ...state, create_new_user_failed: true }
        }
        case 'UPLOAD_IMAGE':{
            return {...state, uploadImage : action.payload }
        }
        case 'USER_DATA':{
            return {...state, userData : action.payload }
        }
        default: return state;
    }
}