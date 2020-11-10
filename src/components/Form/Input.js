import React, { forwardRef } from 'react';
import { Input as AntInput } from 'antd';
import Label from '@components/Form/Label';
import WarningMsg from '@components/Form/WarningMsg';
import Translate from '@components/Translate';

const Input = forwardRef(({label, id, name, title, inputClass = '', inputOptions, warningMsg = "This is a required field.", warningId, warningClass = '', placeholder, value, onChange = () => {}, onBlur = () => {}, hasError, required, validate = {}, ...props}, ref) => {
    const handleOnBlur = e => {
        onBlur(e);
    }

    return (
        <Translate>
            {({translate}) => (
            <div>
                {label ? <Label label={label} forId={id} required={required}/> : null}
                <AntInput
                    ref={ref}
                    type="text"
                    name={name}
                    title={title}
                    id={id}
                    className={`${inputClass} ${hasError ? 'validation-failed' : ''}`}
                    autoComplete="off"
                    value={value}
                    onChange={onChange}
                    onBlur={handleOnBlur}
                    placeholder={translate(placeholder)}
                    {...inputOptions}  />

                {(hasError && warningMsg) && <WarningMsg msg={warningMsg} className={warningClass} id={warningId}/>}
                
                {props.customField}
            </div>
        )}
        </Translate>
    )
})

export default Input;