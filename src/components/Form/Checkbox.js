import React, { forwardRef, memo } from 'react';
import Label from '@components/Form/Label';
import WarningMsg from '@components/Form/WarningMsg';

const Checkbox = forwardRef(({label, id, name, title, checkboxClass = '', checkboxOptions, warningMsg, warningId, warningClass, value, onChange = () => {}, hasError, required, disabled = false, ...props}, ref) => {

    return (
        <>
            <div className="checkbox-theme style-formal">
                <input type="checkbox" id={id} name={name} value={value} ref={ref({required})} className={checkboxClass} onChange={onChange} disabled={disabled} {...checkboxOptions}/>
                <Label label={label} forId={id} id={`${id}-label`} required={required}/>
            </div>
            {(hasError && warningMsg) && <WarningMsg msg={warningMsg} className={warningClass} id={warningId}/>}
        </>
    )
})

export default memo(Checkbox);