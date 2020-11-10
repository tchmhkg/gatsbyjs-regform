import React, { forwardRef } from 'react';
import WarningMsg from '@components/Form/WarningMsg';
import Translate from '@components/Translate';

const Select = forwardRef(({id, name, selectClass = '', value, title, placeholder, noPlaceholder = false, options = [], onChange = () => {}, hasError, warningId, warningClass, warningMsg = "Please select an option.", required, ...props}, ref) =>{

    const handleOnChange = (e) => {
        onChange(e.target.value);
    }
    return (
        <Translate>
        {({translate, activeLanguage}) => (
        <div>
            <div className={`select-theme ${hasError ? 'validation-failed' : ''}`}>
                <select ref={ref} id={id} name={name} title={title} className={`form-control ${selectClass} ${hasError ? 'validation-failed' : ''}`} onChange={handleOnChange} value={value}>
                    {!noPlaceholder ? <option value="">{translate(placeholder)}</option> : null}
                    {options.map(({value, label, ...option}) => (
                        <option key={value} value={value} {...option}>{translate(label)}</option>
                    ))}
                </select>
            </div>
            
            {(hasError && warningMsg) && <WarningMsg msg={warningMsg} className={warningClass} id={warningId}/>}

        </div>
        )}
        </Translate>
    )
})

export default Select;