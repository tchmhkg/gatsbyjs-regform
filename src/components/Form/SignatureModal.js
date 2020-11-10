import React, { forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import ReactModal from 'react-modal';

import Translate from '@components/Translate';

ReactModal.setAppElement('#___gatsby');

const SignatureModal = forwardRef(({name, id, ...props}, ref) => {
    const clearSignature = () => {
        ref.current.clear();
        props.onEnd();
    }

    return (
        <Translate>
            {({translate}) => (
                <ReactModal 
                    isOpen={props.showModal}
                    id="reactModal"
                    style={{
                        content: {
                            height: 350
                        },
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, .5)'
                        }
                    }}
                    onRequestClose={props.onClose}
                    onAfterOpen={() => {
                        let container = document.getElementById("signatureModalBody");
                        const canvas = document.getElementById("sigCanvas");
                        const containerWidth = container?.getBoundingClientRect?.().width;
                        if(containerWidth) {
                            canvas.width = containerWidth;
                        }
                        ref.current.clear();
                        ref.current.fromDataURL(props.signatureSrc, {width: canvas.width, height: canvas.height})
                    }}
                >
                    <div id="signatureModalDialog">
                        <div>
                            <button className="btn btn-theme" onClick={clearSignature}>{translate('Clear')}</button>
                            <button type="button" className="close" aria-label="Close" onClick={props.onClose}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <hr />
                        <div id="signatureModalBody">
                            <SignatureCanvas
                                ref={ref}
                                velocityFilterWeight={1}
                                canvasProps={{height: 220, className: 'signature-canvas', id: 'sigCanvas'}} 
                                minWidth={2}
                                penColor="#4d4d4d"
                                onEnd={props.onEnd}
                                clearOnResize={false}
                            />
                        </div>
                    </div>
                </ReactModal>
            )}
        </Translate>
    )
})

export default SignatureModal;