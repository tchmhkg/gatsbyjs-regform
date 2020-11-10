import React, { memo } from 'react';
import { LanguageContext } from '@providers/LanguageProvider';

const Translate = ({id, data, ...props}) => {
    const renderChildren = (context) => {
    
        return typeof props.children === 'function'
            ? props.children(context)
            : context.translate && (context.translate(id, data));
    }

    return (
        <LanguageContext.Consumer>
            {value => renderChildren(value)}
        </LanguageContext.Consumer>
    )
}

export default memo(Translate);