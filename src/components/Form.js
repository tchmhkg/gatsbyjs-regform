import React, { useState, useRef, memo } from 'react';
import { useForm, FormContext } from "react-hook-form";

import API  from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';

import ContactSection from '@components/Form/Sections/ContactSection';
import PeSection from '@components/Form/Sections/PeSection';
import SignatureSection from '@components/Form/Sections/SignatureSection';
import TncSection from '@components/Form/Sections/TncSection';

import Complete from '@components/Complete';
import Spinner from '@components/Spinner';

import { convertDistributorApiData, getHashedFilePath, getHashedBase64Path, convertCheckDuplicateApiData } from '@helpers';
import { awsConfig } from '@configs';
import { useTranslate } from '@hooks/translate';

const Form = () => {
    const methods = useForm({
        mode: 'onBlur', 
        reValidateMode: 'onBlur',
        defaultValues: {
            'country': 'KZ',
            'telephone_country_code': 7
        }
    });
    const {handleSubmit, setValue, getValues, watch, setError } = methods;
    const { certificate_src, pe_certificate_src, signature_src, tax_id_proof_src } = getValues();
    
    const translate = useTranslate();
    const signatureRef = useRef(null);

    const signatureToImage = (clear = false) => {
        if(clear) {
            signatureRef.current.clear();
        }
        if(!signatureRef.current.isEmpty()) {
            const trimmedCanvas = signatureRef.current.getTrimmedCanvas()
            const trimmedImage = trimmedCanvas.toDataURL('image/png');
            const image = signatureRef.current.toDataURL('image/png');
            const hashedPath = getHashedBase64Path(trimmedImage, 'SIGNATURE');

            setValue('signature_src', hashedPath);
            setTrimmedSignatureSrc(trimmedImage);
            setSignatureSrc(image);
        } else {
            setValue('signature_src', '');
            setTrimmedSignatureSrc('');
            setSignatureSrc('');
        }
    }

    const handleChangeFile = (file, key, func) => {
        if(file){
            const mapping = [
                {key: 'certificate_src', type: 'CERTIFICATE'},
                {key: 'pe_certificate_src', type: 'PE_CERTIFICATE'},
                {key: 'tax_id_proof_src', type: 'TAX_ID'}
            ]
            const type = mapping.find(item => item.key === key).type;
            func(file);
            const hashedPath = getHashedFilePath(file, type);
            setValue(key, hashedPath);
        }
    }

    const validateDob = () => {
        const dateValues = watch(['year', 'month', 'day']);
        const { year, month, day } = dateValues;
        let date = new Date;
        let countDaysInMonth = 0;
        date.setYear(parseInt(year, 10));
        date.setMonth(parseInt(month, 10)-1, 32);
        countDaysInMonth = 32 - date.getDate();
        if(!countDaysInMonth || countDaysInMonth>31) {
            countDaysInMonth = 31;
        }
        const isDayValid = day >=1 && day <= countDaysInMonth;
        if(!isDayValid) {
            setError('day', 'dayNotValid', translate("Please enter a valid day.", {
                day: countDaysInMonth,
            }))
            document.getElementById('day').scrollIntoView();
            return false;
        }

        date.setFullYear(year, month-1, day);

        var currdate = new Date();
        var setDate = new Date();
        setDate.setFullYear(date.getFullYear() + 18, month-1, day);

        if ((currdate - setDate) < 0){
            setError('year', 'ageNotValid', translate('You must be 18 years old or over.'))
            document.getElementById('year').scrollIntoView();
            return false;
        }
        return true;
    }

    const onSubmit = data => {
        // console.log(data)
        if(!validateDob()) {
            return;
        }
        setIsLoading(true);
        postCheckDuplicate(data);
    };

    const uploadSignature = async (base64, path) => {
        const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const type = base64.split(';')[0].split('/')[1];

        if(base64) {
            const { key } = await Storage.put(path, base64Data, {
                contentType: `image/${type}`,
                contentEncoding: 'base64',
            }).catch(err => console.log(err));
            return key;
        }
    }

    const submitUploadFile = async (file, path) => {;
        if(file) {
            const { key } = await Storage.put(path, file, {
                contentType: file.type,
            }).catch(err => console.log(err));
            return key;
        }
    }

    const [certSrc, setCertSrc] = useState('');
    const [peCertSrc, setPeCertSrc] = useState('');
    const [signatureSrc, setSignatureSrc] = useState('');
    const [trimmedSignature, setTrimmedSignatureSrc] = useState('');
    const [taxIdProofSrc, setTaxIdProofSrc] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const postCheckDuplicate = async(data) => {
        let apiName = awsConfig?.API?.endpoints?.[0]?.name;
        let path = '/member/v1/checkDuplicates';
        let myInit = {
            headers: {},
            response: true,
        }
        myInit.body = convertCheckDuplicateApiData(data);
        return await API.post(apiName, path, myInit)
            .then(res => {
              if(res.data?.data?.result === 1) {
                postRegister(data);
              } else {
                alert(translate(res.data?.data?.result));
                setIsLoading(false);
              }
            })
            .catch(error => {
                alert(translate(error.response?.data?.error?.code))
                setIsLoading(false);
            });
    }

    const postRegister = async(data) => {
        let apiName = awsConfig?.API?.endpoints?.[0].name;
        let path = '/member/v1/register';
        let myInit = {
            headers: {},
            response: true,
        }
        myInit.body = convertDistributorApiData(data);

        if(typeof window !== 'undefined') {
            window.dataLayer.push({'referral_number': data.referral_number});
            window.dataLayer.push({
                'event': 'formSubmission',
                'formData': data
            });
        }
        return await API.post(apiName, path, myInit)
            .then(async res => {
                if(res.data?.success) {
                    if(trimmedSignature) {
                        await uploadSignature(trimmedSignature, signature_src);
                    }
                    if(certSrc) {
                        await submitUploadFile(certSrc, certificate_src);
                    }
                    if(data.is_pe && peCertSrc) {
                        await submitUploadFile(peCertSrc, pe_certificate_src);
                    }
                    if(taxIdProofSrc) {
                        await submitUploadFile(taxIdProofSrc, tax_id_proof_src)
                    }
                    setIsLoading(false);
                    setIsCompleted(true);
                    if(typeof window !== 'undefined') {
                        window.dataLayer.push({'event': 'isSuccess'});
                        window.localStorage.removeItem('joint_site');
                        window.localStorage.removeItem('referral_number');
                    }
                } else {
                    setIsLoading(false);
                }
            })
            .catch(error => {
                setIsLoading(false);
                alert(error.response?.data?.error?.message);
            });
    }

    if(isCompleted) {
        return (
            <Complete />
        )
    }

    return (
        <div className="container">
            <FormContext {...methods} > 
                <form id="form-reg-contact" method="POST" onSubmit={handleSubmit(onSubmit)}>

                    <div id="wrapper-reg-form-view">
                        <div className="page-title">
                            <h5>{translate('Kazakhstan Distributor Registration')}</h5>
                        </div>
                        <ContactSection 
                            handleChangeFile={handleChangeFile}
                            setTaxIdProofSrc={setTaxIdProofSrc}
                            taxIdProofSrc={taxIdProofSrc}
                            setCertSrc={setCertSrc}
                            certSrc={certSrc}
                        />
                        
                        <PeSection 
                            handleChangeFile={handleChangeFile}
                            setPeCertSrc={setPeCertSrc}
                            peCertSrc={peCertSrc}
                        />

                        <SignatureSection 
                            signatureToImage={signatureToImage}
                            signatureSrc={signatureSrc}
                            ref={signatureRef}
                        />
                    </div>
                    {/* T&C */}
                    <TncSection />

                    {/* Submit */}
                    <div className="action-group">
                        <button id="btn-reg-review-info" type="submit" title="Submit" className="btn btn-theme">{translate('Submit')}</button>
                    </div>
                </form>
            </FormContext>
            {isLoading && <Spinner/>}
        </div>
    )
}

export default memo(Form);