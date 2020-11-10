export const CLEAR = 'CLEAR';
export const RESET_PAGE = 'RESET_PAGE';

export const unsetData = ( payload ) => {
    return { type: CLEAR, payload };
}

export const resetPage = ( payload ) => {
    return { type: RESET_PAGE, payload}
}