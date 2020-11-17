import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers =
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
      })) ||
    compose;

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );

  sagaMiddleware.run(rootSaga);

  return { store };
}
