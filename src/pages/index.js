import React from 'react';
import { Router, useLocation } from "@reach/router";
import API  from '@aws-amplify/api';
import Auth  from '@aws-amplify/auth';
import Storage from '@aws-amplify/storage';
import { useDispatch } from 'react-redux';
import map from 'lodash/map';

import Registration from '@pages/registration';
import Metadata from '@components/Metadata';
import { awsConfig, languages } from '@configs';
import { setLocale } from '@actions/lang';
import { getVarFromURL } from '../helpers';

API.configure({
  endpoints: awsConfig?.API?.endpoints
});
Auth.configure(awsConfig?.Auth);
Storage.configure(awsConfig?.Storage);

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [currentLocale, setCurrentLocale] = React.useState(languages?.default)

  React.useEffect(() => {
    const pathname = location.pathname;
    const pathnames = pathname.split('/');

    const availables = map(languages?.available, 'code');
    let targetLocale = availables.indexOf(pathnames[1]) > -1
                        ? pathnames[1]
                        : languages?.default;

    if (typeof window !== "undefined") {
      const jointSite =
        getVarFromURL(pathname, "site") ||
        window.localStorage.getItem("joint_site");

      window.dataLayer.push({
        environment: {
          gaTrackingLocale: targetLocale,
          gaTrackingMarket: 'KZ',
          gaTrackingChannel: 'web',
          gtmTrackingJointSite: jointSite
        }
      });
    }
    dispatch(setLocale(targetLocale));
    setCurrentLocale(targetLocale)
  }, [dispatch, location.pathname])

  return (
    <>
      <Metadata />
      <Router>
        <Registration path="/:locale" default/>
      </Router>
    </>
  );
}

export default App;