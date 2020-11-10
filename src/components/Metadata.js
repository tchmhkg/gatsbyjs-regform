import React, { memo } from 'react';
import { Helmet } from "react-helmet";
import { useTranslate } from '@hooks/translate';

export default memo(() => {
    const translate = useTranslate();
    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{translate("Kazakhstan Distributor Registration")}</title>
        </Helmet>
    )
})