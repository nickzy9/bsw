import { Appearance, Platform } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import React, { useEffect } from "react";
import { AppNavigatonContainer } from "./navigation/AppNavigatonContainer";
import i18n from './localization/BSWi18n';
import { I18nextProvider } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';

const App: React.FC = () => {
  const colorScheme = Appearance.getColorScheme();
  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppNavigatonContainer />
      </I18nextProvider>
    </Provider>
  );
};

export default App;