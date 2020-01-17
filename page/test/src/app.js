/**
 * 360loan-india 入口
 * @author Xiaolong
 */
import 'core-js/modules/es.object.assign';
import 'core-js/modules/es.array.from';
// import 'core-js/modules/es.set';
import 'core-js/modules/es.object.entries';
// import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import 'src/style/init.scss';
import init from 'src/utils/init';
import createHistory from './utils/init/history';
import store from './store';
import App from './pages/index';
import 'src/utils/init/eventListener';


const renderApp = async (Root) => {
  await init();
  render(
    <AppContainer>
      <Router history={createHistory}>
        <Provider store={store}>
          <Root />
        </Provider>
      </Router>
    </AppContainer>,
    document.getElementById('app'),
  );
};

renderApp(App);

if (module.hot) {
  module.hot.accept(() => renderApp(App));
}
