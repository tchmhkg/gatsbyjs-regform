import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'gatsby';
import { useLocation } from "@reach/router";
import { setLocale } from '@actions/lang';
import Translate from '@components/Translate';

const LanguageSelector = ({isMobile, ...props}) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const getUrl = (language) => {
        const pathname = location.pathname;
        const pathnames = pathname.split('/');
        pathnames[1] = language;
        return pathnames.join('/');
    }

    const onLanguageChanged = (language) => {
        dispatch(setLocale(language.code));
    }

    return (
        <Translate>
            {({ translate, activeLanguage, availableLanguages}) => (
                <div className="dropdown">
                    <a
                        className="dropdown-toggle"
                        data-toggle="dropdown"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                    {translate('language_label')} <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown-languages">
                    { availableLanguages.map(language => 
                        <li className={(activeLanguage === language.code) ? "active" : ''} key={language.code} >
                            <Link id={`btn-switch-lang-${language.code}`} to={getUrl(language.code)} onClick={() => onLanguageChanged(language)}>
                                <div>{translate(language.name)}</div>
                            </Link>
                        </li>
                    )}
                    </ul>
                </div>
            )}
        </Translate>
    );

}

export default memo(LanguageSelector);
