import {
  createStore,
  applyMiddleware,
} from 'redux';

import createSagaMiddleware from 'redux-saga';

import bot from './bot';
import reducer from './reducer';

import {
  updateRepositoriesSaga,
} from './sagas/updateRepositories';

import {
  mergePullsSaga,
} from './sagas/mergePulls';

import {
  deleteBranchesSaga,
} from './sagas/deleteBranch';

import {
  Application,
} from './entities/Application';

export = (app: Application) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducer,
    applyMiddleware(
      sagaMiddleware,
    ),
  );

  sagaMiddleware.run(
    updateRepositoriesSaga,
  );

  sagaMiddleware.run(
    mergePullsSaga,
  );

  sagaMiddleware.run(
    deleteBranchesSaga,
  );

  app.store = store;

  bot(app);
};
