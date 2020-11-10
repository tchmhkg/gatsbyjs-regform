import React, { useState, forwardRef } from 'react';

import WarningMsg from '@components/Form/WarningMsg';
import Label from '@components/Form/Label';
import { useTranslate } from '@hooks/translate';

const CertUpload = forwardRef(({name, value, id, hasError, warningMsg = "This is a required field.", warningId, warningClass = '', required, placeholder = "", ...props}, ref) => {
    const [readonly, setReadonly] = useState(false);
    const [filename, setFilename] = useState('');
    const [message, setMessage] = useState('');
    const translate = useTranslate();
    const uploadLimit = process.env.UPLOAD_LIMIT || 10;
    
    const handleOnChangeUpload = (event) => {
        const file = event.target.files[0];
        if(file.size > uploadLimit*1024*1024){
            setMessage(translate('The file you uploaded is larger than Megabytes allowed by server', {size: uploadLimit}));
            return false;
        }
        props.onChange(file);
        // console.log('file =>',file);
        setFilename(file.name);
        setReadonly(true);
        setMessage('');
    }

    const handleCancelUpload = () => {
        props.onChange(null)
        setFilename('');
        setReadonly(false);
        setMessage('');
    }


    return (
            <div className="form-group" >
                {
                    readonly?
                    <div id="contactus_img_name">
                        <span id="contactus_img_name_label">{filename}</span>&nbsp;
                            <button type="button" className="close" aria-label="Close" onClick={handleCancelUpload}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>
                    :<div>
                        <div>
                            <Label forId={`${id}_input`} labelClass="btn btn-theme-apply" label="Choose File" />
                        </div>
                        <input
                            type="file" className="input-file" id={`${id}_input`} 
                            name={`${name}_input`} accept="image/*"
                            onChange={handleOnChangeUpload}
                            style={{display: 'none'}}
                        />
                        <div className="content-upload ">
                            <p id="cert-upload-status" className="upload-status">
                                {translate(placeholder, {size: uploadLimit})}
                            </p>
                        </div>
                    </div>
                }
                <input ref={ref} autoComplete="off" type="hidden" name={name} id={id} />
                
                {(hasError && warningMsg) && <WarningMsg msg={warningMsg} className={warningClass} id={warningId}/>}
                <div className="help-block errors">{message}</div>
            </div>
        )
})

export default CertUpload;