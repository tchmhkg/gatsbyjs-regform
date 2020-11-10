import React, { memo } from 'react';
import tickImage from '@images/icon-tick.png';
import Translate from '@components/Translate';

const Complete = () => {
    return (
        <Translate>
            {({translate}) => (
                <div className="container">
                    <div className="row">
                        <div className="offset-md-2 col-sm-8">
                            <div className="page-title" id="lbl-registration-completed">
                                <h1>{translate('Registration Completed')}</h1>
                                <span>{translate('registration_completed_message')}​</span><br />
                                <span dangerouslySetInnerHTML={{__html: translate('registration_completed_message_2')}}/>
                            </div>
                            <p className="text-center">
                                <img src={tickImage} alt=""/>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Translate>
    )
}

export default memo(Complete);