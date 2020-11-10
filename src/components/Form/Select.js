import React, { forwardRef } from 'react';
import { Select as AntSelect } from 'antd';
import WarningMsg from '@components/Form/WarningMsg';
import Translate from '@components/Translate';
const { Option } = AntSelect;

const Select = forwardRef(({id, name, selectClass = '', value, title, placeholder, noPlaceholder = false, options = [], onChange = () => {}, hasError, warningId, warningClass, warningMsg = "Please select an option.", required, ...props}, ref) =>{

    const handleOnChange = (value) => {
        onChange(value);
    }
    return (
        <Translate>
        {({translate, activeLanguage}) => (
        <div>
            <div className={` ${hasError ? 'validation-failed' : ''}`}>
                <AntSelect style={{ minWidth: '100%' }} ref={ref} id={id} name={name} title={title} className={`${selectClass} ${hasError ? 'validation-failed' : ''}`} onChange={handleOnChange} value={value}>
                    {!noPlaceholder ? <Option value="">{translate(placeholder)}</Option> : null}
                    {options.map(({value, label, ...option}) => (
                        <Option key={value} value={value} {...option}>{translate(label)}</Option>
                    ))}
                </AntSelect>
            </div>
            
            {(hasError && warningMsg) && <WarningMsg msg={warningMsg} className={warningClass} id={warningId}/>}

        </div>
        )}
        </Translate>
    )
})

export default Select;