import { combineReducers } from 'redux'
import { LANG_SET_LOCALE } from '@actions/lang'

const locale = (state = null, action) => {
    switch (action.type) {
        case LANG_SET_LOCALE:
            return action.payload
        default:
            return state;
    }
}

const langReducer = combineReducers({locale})
export default langReducer