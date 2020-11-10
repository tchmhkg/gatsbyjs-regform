import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EN from "@i18n/en.json";
import CN from "@i18n/zh-cn.json";
import RU from "@i18n/ru.json";
import KK from '@i18n/kk.json';
import { languages } from '@configs';

const translations = {
    en: EN,
    'zh-cn': CN,
    kk: KK,
    ru: RU
};

export const LanguageContext = React.createContext({
    availableLanguages:[],
    activeLanguage: 'en',
    translate: () => {}
});
export const LanguageConsumer = LanguageContext.Consumer;

export const getTranslate = (locale) => (id, data) => {
    if (!locale)
        locale = languages?.default
  
    let text = translations[locale][id];
  
    if (text === undefined)
        return id;
        // return 'Missing translation for key `' + id + '`';
  
    for (let prop in data) {
        const pattern = '\\${\\s*' + prop + '\\s*}';
        const regex = new RegExp(pattern, 'gmi');
        
        let translatedProps = translations[locale][data[prop]];
  
        if(translatedProps === undefined) {
            translatedProps = data[prop];
        }
        
        text = text.replace(regex, translatedProps);
    }
  
    return text;
}

const LanguageProvider = React.forwardRef(({...props}, ref) => {
    const locale = useSelector(state => state.lang.locale);

    const translate = (id, data) => {

        const translation = getTranslate(activeLanguage);

        return translation(id, data);
    }

    const [activeLanguage, setActiveLanguage] = useState(languages?.default);
    const [availableLanguages] = useState(languages?.available);

    useEffect(() => {
        setActiveLanguage(locale);
    }, [locale])
    return (
        <LanguageContext.Provider
                value={{activeLanguage, availableLanguages, translate}}
                ref={ref}
            >
            {props.children}
        </LanguageContext.Provider>
    )
})

export default LanguageProvider;