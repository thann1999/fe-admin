import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import { BrowserRouter } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import * as serviceWorker from './serviceWorker';

const persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <PersistGate loading={<div>...Loading</div>} persistor={persistor}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </PersistGate>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
