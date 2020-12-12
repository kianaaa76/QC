import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {createWhitelistFilter} from 'redux-persist-transform-filter';
import ReduxThunk from 'redux-thunk';
import reducers from '../reducers';

const persistedStates = createWhitelistFilter('reducers', ['access_token', 'refresh_token']);

const persistConfig = {
  key: 'root',
  storage: storage,
  transforms: [persistedStates]
};

const persistedReducer = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducer, {}, applyMiddleware(ReduxThunk));
const persistor = persistStore(store);

const getPersistor = () => persistor;
const getStore = () => store;
const getState = () => {
  return store.getState();
};
export {getStore, getState, getPersistor};
