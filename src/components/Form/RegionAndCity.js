import React, { memo, useState, useEffect } from 'react';
import { useFormContext } from "react-hook-form";
import { useSelector } from 'react-redux';
import { useTranslate } from '@hooks/translate';

import Label from '@components/Form/Label';
import Select from '@components/Form/Select';

const RegionAndCity = () => {
    const translate = useTranslate();
    const locale = useSelector(state => state.lang.locale);
    const regionsSource = locale ? require(`@data/regions/${locale}.json`) : [];
    const citiesSource = locale ? require(`@data/cities/${locale}.json`) : [];

    const { register, errors, setValue, getValues } = useFormContext();
    const { region_id } = getValues();
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    
    useEffect(() => {
        setRegions(regionsSource.map(region => (
            {label: region[2], value: region[1]}
        )));
        if(region_id) {
            setCities(citiesSource.filter(city => city[1] === region_id).map(city => (
                {label: city[3], value: city[2], region_id: city[1]}
            )))
        }
    }, [regionsSource.join(',')])

    const handleChangeRegion = regionId => {
      setCities(citiesSource.filter(city => city[1] === regionId).map(city => (
        {label: city[3], value: city[2], region_id: city[1]}
      )))
      setValue('city_id', '');
    }

    return (
        <div className="row">
            <div className="col-sm-6 form-group">
                <Label forId="region_id" label='Region/State/Province' required/>
                <Select 
                ref={register({required: true})}
                required
                hasError={errors.region_id}
                name="region_id"
                id="region_id"
                title={translate('Region/State/Province')}
                placeholder='Please select region, state or province'
                options={regions}
                // value={region_id}
                onChange={handleChangeRegion}
                />
            </div>
            <div className="col-sm-6 form-group">
                <Label forId="city_id" label='City' required/>
                <Select 
                ref={register({required: true})}
                required
                hasError={errors.city_id}
                name="city_id"
                title={translate('City')}
                placeholder='Please select city'
                options={cities}
                // value={city_id}
                />
            </div>
        </div>
    )
}

export default memo(RegionAndCity);