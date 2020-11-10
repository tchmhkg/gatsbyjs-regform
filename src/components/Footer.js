import React, { memo } from 'react';
import Translate from '@components/Translate';

const Footer = () => {
    return (
        <Translate>
            {({translate}) => (
                <footer id="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12" id="col-copyright">
                                {translate('Registration_copyright_footer_text', {year: new Date().getFullYear()})}
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </Translate>
    )
}

export default memo(Footer);