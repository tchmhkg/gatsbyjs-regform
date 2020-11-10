import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import Translate from '@components/Translate';
import { getIgiUrlByKey } from '@helpers';

const Tnc = () => {
    const locale = useSelector(state => state.lang.locale);

    return (
        <Translate>
            {({translate}) => (
                Array.isArray(translate("tncLabels")) ? translate("tncLabels").map((label, index) => {
                    if(label.clickable) {
                        return <a key={index} href={getIgiUrlByKey(label.key, locale)} target='_blank' className="tnc-link">{label.text}</a>
                    }
                    return <span key={index}>{label.text}</span>
                }) : translate("tncLabels")
            )}
        </Translate>
    )
}

export default memo(Tnc);