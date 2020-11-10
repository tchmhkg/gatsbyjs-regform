import React, { memo } from 'react';
import Translate from '@components/Translate';

const WarningMsg = ({className = '', id, msg = "This is a required field."}) => {

    return (
        <Translate>
            {({translate}) => (
                <p className={`help-block validation-advice ${className}`} id={id}>{translate(msg)}</p>
            )}
        </Translate>
    )
}

export default memo(WarningMsg);