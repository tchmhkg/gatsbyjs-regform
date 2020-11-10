import React from "react"
import { Provider } from "react-redux"
import configureStore from "./src/store"
import LanguageProvider from './src/providers/LanguageProvider';
export default ({ element }) => {
  const store = configureStore();
  return (
  <Provider store={store}>
    <LanguageProvider>
      {element}
    </LanguageProvider>
  </Provider>);
}