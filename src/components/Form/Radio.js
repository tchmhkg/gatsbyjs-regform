import React, { forwardRef } from 'react';
import Label from '@components/Form/Label';

const Radio = forwardRef(({label, name, value, id, inline = false, required, ...props}, ref) => {
    return (
        <div className={`custom-control custom-radio ${inline ? 'custom-control-inline' : ''}`}>
            <input className="custom-control-input" type="radio" name={name} id={id} value={value} ref={ref}/>
            <Label labelClass="custom-control-label" forId={id} label={label}/>
        </div>
    )
});

export default Radio;