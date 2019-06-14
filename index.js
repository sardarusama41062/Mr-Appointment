import { AppRegistry } from 'react-native';
import App from './src/containers/App';
import { name as appName } from './app.json';
import React from "react";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from 'redux-thunk';
import rootReducer from "./src/reducers";

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';

import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';


const persistConfig = {
    key: 'root',
    storage,
}
const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3570dd',
      accent: 'yellow',
    },
  };

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer, applyMiddleware(thunk));
let persistor = persistStore(store)

const ProviderComponent = () => {
    return (
        <Provider store={store} >
            <PersistGate loading={null} persistor={persistor}>
                <PaperProvider theme={theme} >
                    <App />
                </PaperProvider>
            </PersistGate>
        </Provider >
    )
}

AppRegistry.registerComponent(appName, () => ProviderComponent);