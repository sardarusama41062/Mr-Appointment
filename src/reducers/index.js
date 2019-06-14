import { combineReducers } from 'redux';
import signUpReducer from './signUpReducer';
import doctorReducer from './doctorReducer';
import userReducer from './userReducer'

const rootReducer = combineReducers({
     signUpReducer, doctorReducer, userReducer, 
});

export default rootReducer;