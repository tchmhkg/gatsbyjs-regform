import { useSelector } from 'react-redux';
import { getTranslate } from '@providers/LanguageProvider';

export const useTranslate = () => {
    const locale = useSelector(state => state.lang.locale);
    return getTranslate(locale);
}