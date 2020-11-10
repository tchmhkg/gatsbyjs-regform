import { createStore } from 'redux';
import { createRootReducer } from '@reducers/createRootReducer';

const configureStore = (appReducers, preloadedState) => createStore(
  createRootReducer(appReducers),
  preloadedState,
)

export default configureStore