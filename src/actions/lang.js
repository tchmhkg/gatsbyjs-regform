export const LANG_SET_LOCALE = 'LANG_SET_LOCALE'
export const LANG_API_REQUEST = 'LANG_API_REQUEST'
export const LANG_API_SUCCESS = 'LANG_API_SUCCESS'
export const LANG_API_FAILURE = 'LANG_API_FAILURE'

export function setLocale(payload) {
    return { type: LANG_SET_LOCALE, payload };
}