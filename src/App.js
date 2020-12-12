import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { getStore, getPersistor } from './redux/store';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const App = () => {
  const routing = useRoutes(routes);
  const myStore = getStore();
  const myPersistor = getPersistor();
  return (
    <Provider store={myStore}>
      <PersistGate loading={null} persistor={myPersistor}>
        <StylesProvider jss={jss}>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            {routing}
          </ThemeProvider>
        </StylesProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
