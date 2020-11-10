import React, { forwardRef, useState, useEffect, memo } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import WarningMsg from '@components/Form/WarningMsg';
import Translate from '@components/Translate';

const Signature = forwardRef(({name, id, hasError, warningMsg, warningId, warningClass, ...props}, ref) => {
    const [isSigning, setIsSigning] = useState(false);
    const handleOpenCanvas = () => {
        setIsSigning(true);
    }
      
    const handleCloseCanvas = (clear = false) => {
        if(!clear) {
            setIsSigning(false);
        }
        props.onEnd(clear);
    }

    useEffect(() => {
        if(isSigning) {
            let container = document.getElementById("signature_view");
            const canvas = document.getElementById("sigCanvas");
            const containerWidth = container?.getBoundingClientRect?.().width;
            if(containerWidth) {
                canvas.width = containerWidth;
            }
            props.onEnd(true); // clear signature
            document.getElementById('signature-title').scrollIntoView();
        }
    }, [isSigning])

    return (
        <Translate>
            {({translate}) => (
                <>
                    <div className="signature-view" id="signature_view">
                        {isSigning ? (
                            <SignatureCanvas
                                ref={ref}
                                velocityFilterWeight={1}
                                canvasProps={{height: 220, className: 'signature-canvas', id: 'sigCanvas'}} 
                                minWidth={2}
                                penColor="#4d4d4d"
                                clearOnResize={false}
                            />
                        ) : (props.signatureSrc ? (
                            <div className="signature-image-wrapper"><img src={props.signatureSrc} alt="Signature"/></div>
                        ) : (
                            <div className="remark-box">
                                <div className="remark-text" onClick={handleOpenCanvas}>{translate('Click here to sign')}</div>
                            </div>
                        ))}
                    </div>
                    {isSigning ? (
                        <div className="d-flex flex-row justify-content-between">
                            <a className="signature-action" onClick={() => handleCloseCanvas(true)}>{translate('Clear')}</a>
                            <button className="btn btn-theme signature-action-btn" onClick={() => handleCloseCanvas()}>{translate('Complete')}</button>
                        </div>
                    ) : (props.signatureSrc ? (
                        <a className="signature-action" onClick={handleOpenCanvas}>{translate('Sign again')}</a>
                    ) : null)}

                    {(hasError && warningMsg) && <WarningMsg msg={warningMsg} className={warningClass} id={warningId}/>}

                    <input type="hidden" name={name} id={id} ref={props.inputRef} />
                </>
            )}
        </Translate>
    )
})

export default memo(Signature);