import React, { memo } from 'react';
import Translate from '@components/Translate';

const TncModal = () => {
    return (
        <Translate>
            {({translate}) => (
                <div className="modal fade" id="termsAndConditionsModal" tabIndex="-1" role="dialog" aria-labelledby="termsAndConditionModal" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{translate('Terms and Conditions')}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div dangerouslySetInnerHTML={{__html: translate("tncContent")}} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Translate>
    )
}

export default memo(TncModal);