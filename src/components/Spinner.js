import React, { memo } from 'react';

export default memo(() => (
    <div className="overlay-spinner">
        <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
))