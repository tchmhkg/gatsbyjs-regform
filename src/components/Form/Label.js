import React, { memo } from 'react';
import Translate from '@components/Translate';

const Label = ({label, forId = "", labelClass = "", id = "", required, ...props}) => {
    return (
        <Translate>
            {({translate}) => (
                <label htmlFor={forId} className={`${required ? 'required' : ''} ${labelClass}`} id={id}>{translate(label)}</label>
            )}
        </Translate>
    )
}

export default memo(Label);