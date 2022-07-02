import md5 from 'crypto-js/md5';

const IGI_DOMAIN = '';
const KAZAKHSTAN = "KZ";
const INDIVIDUAL = "IDV";
// const FOREIGNER = "FORE";
const PE = "IDVE";
const DISTRIBUTOR = "DIS";
// const WEB = "WEB";
const DISAP = "DISAP";
const PASSPORT = "PPT";

const addLeadingZeroIfNeeded = value => value < 10 ? '0' + value : value;

export const getIgiUrlByKey = (fileKey, lang = 'en') => {
    const convertedLang = lang?.replace('-','_');
    return `${IGI_DOMAIN}/documents/kz_${convertedLang}/${fileKey}.pdf`;
}

export const getVarFromURL = (url, varName) => {
    const parts = url.split("/");
    const targetIndex = parts.indexOf(varName);
    if(targetIndex !== -1) {
        return parts[targetIndex + 1]
    }
    return null;
}

export const getHashedFilePath = (file, fileType) => {
    const ext = file.name.split('.').pop() && file.name.split('.').pop().toLowerCase();
    const hashedFileName = `${md5(file.name).toString()}-${Date.now()}.${ext}`;
    
    return `${fileType}/${KAZAKHSTAN}/${hashedFileName}`;
}

export const getHashedBase64Path = (base64, fileType) => {
    const type = base64.split(';')[0].split('/')[1];
    const hashedFileName = `${md5(base64).toString()}-${Date.now()}.${type}`;
    
    return `${fileType}/${KAZAKHSTAN}/${hashedFileName}`;
}

export const convertCheckDuplicateApiData = form => {
    let data = {
        "market": KAZAKHSTAN,
        "memberRole": DISTRIBUTOR,
        "idNumber": form.certificate_number,
        "idType": form.certificate_type,
        "mobileAreaCode": form.telephone_country_code,
        "mobileNumber": form.telephone,
        "email": form.secondary_email,
        "firstNameChn": form.chinese_firstname,
        "lastNameChn": form.chinese_lastname,
        "firstNameEng": form.firstname,
        "lastNameEng": form.lastname
    }

    return ({data});
}

const convertMemberType = (type, isPe = false) => {
    if(isPe && type !== PASSPORT) {
        return PE;
    }
    return INDIVIDUAL;
}

export const convertDistributorApiData = form => {
    let data = {
        "appNo": Date.now() + "_kzreg",
        "market": KAZAKHSTAN,
        "sponsorId": form.referral_number,
        "firstNameChn": form.chinese_firstname,
        "lastNameChn": form.chinese_lastname,
        "firstNameEng": form.firstname,
        "lastNameEng": form.lastname,
        "memberRole": DISTRIBUTOR,
        "memberType": convertMemberType(form.certificate_type, form.is_pe),
        "idType": form.certificate_type,
        "idNumber": form.certificate_number,
        "birthday": form.year + "-" + addLeadingZeroIfNeeded(form.month) + "-" + addLeadingZeroIfNeeded(form.day),
        "gender": form.gender,
        "language": 'ZH-CN',
        "eshopUrl": "",
        "education": "",
        "race": "",
        "nationality": "",
        "password": "",
        "passcodeRuleVersion": "v1",
        "perCountry": KAZAKHSTAN,
        "perState": form.region_id,
        "perCity": form.city_id,
        "perAddress": form.street1,
        "perAddress2": form.street2,
        "perAddress3": "",
        "perZipCode": form.postcode,
        "curCountry": KAZAKHSTAN,
        "curState": form.region_id,
        "curCity": form.city_id,
        "curAddress": form.street1,
        "curAddress2": form.street2,
        "curAddress3": "",
        "curZipCode": form.postcode,
        "taxId": form.iin,
        "taxCountry": KAZAKHSTAN,
        "taxState": form.region_id,
        "taxCity": form.city_id,
        "taxAddress": form.street1,
        "taxAddress2": form.street2,
        "taxAddress3": "",
        "taxZipCode": form.postcode,
        "phoneNumberAreaCode": "",
        "phoneNumber": "",
        "mobileAreaCode": form.telephone_country_code,
        "mobileNumber": form.telephone,
        "emailAddress": form.secondary_email,
        // "payeeName": "string",
        // "bankCode": "string",
        // "bankAccount": "string",
        // "bankAccountIdNumber": "string",
        // "bonusPaymentMethod": "string",
        "spouseFirstNameChn": "",
        "spouseLastNameChn": "",
        "spouseFirstNameEng": "",
        "spouseLastNameEng": "",
        "spouseIDType": "",
        "spouseID": "",
        "spouseBirthday": "",
        "beneficiaryFirstNameChn": "",
        "beneficiaryLastNameChn": "",
        "beneficiaryFirstNameEng": "",
        "beneficiaryLastNameEng": "",
        "beneficiaryIDType": "",
        "beneficiaryID": "",
        "beneficiaryBirthday": "",
        "beneficiaryRelationship": "",
        "promotionOptIn": "N",
        "registerationChannel": DISAP,
        "travelPlanMonth": "",
        "attachments": [],
        "jointSite": form.joint_site
        // "onlinePayoutAccount": "string"
    }
    
    if(form.certificate_src) {
        data.attachments.push(
            {"fileType": "CERTIFICATE", "fileKey": '/' + form.certificate_src}
        )
    }
    if(form.signature_src) {
        data.attachments.push(
            {"fileType": "SIGNATURE", "fileKey": '/' + form.signature_src}
        )
    }
    if(form.is_pe && form.pe_certificate_src) {
        data.attachments.push(
            {"fileType": "PE_CERTIFICATE", "fileKey": '/' + form.pe_certificate_src}
        )
    }
    if(form.tax_id_proof_src) {
        data.attachments.push(
            {"fileType": "TAX_ID", "fileKey": '/' + form.tax_id_proof_src}
        )
    }
    return ({data});
}