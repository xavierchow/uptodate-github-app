import {
  expectSaga,
} from 'redux-saga-test-plan';

import {
  ContextPayloadPushAuthenticated,
  getLogInfo,
} from '../entities/eventPayloads';

import {
  defaultConfig,
} from '../entities/config';

import {
  RecursivePartial,
} from '../types';

import {
  readRepoConfigSaga,
} from './readConfig';

describe('sagas/readRepoConfig', () => {
  it('should return the repo config', async () => {
    const config = {
      test: 'test',
    };

    const mockedContext: RecursivePartial<ContextPayloadPushAuthenticated> = {
      log: {
        error: jest.fn(),
      } as unknown as ContextPayloadPushAuthenticated['log'],
      config: jest.fn()
        .mockResolvedValue(config) as unknown as ContextPayloadPushAuthenticated['config'],
      payload: {
        repository: {
          owner: {
            login: 'guillaumewuip',
          },
          name: 'test',
        },
        installation: {
          id: 1,
        },
      },
    };
    const context = mockedContext as unknown as ContextPayloadPushAuthenticated;

    await expectSaga(
      readRepoConfigSaga,
      context,
    )
      .returns(config)
      .run(false);
  });

  it('should return the default config and log if error', async () => {
    const readConfigError = new Error('');
    const mockedContext: RecursivePartial<ContextPayloadPushAuthenticated> = {
      log: {
        error: jest.fn(),
      } as unknown as ContextPayloadPushAuthenticated['log'],
      payload: {
        repository: {
          owner: {
            login: 'guillaumewuip',
          },
          name: 'test',
        },
        installation: {
          id: 1,
        },
      },
      config: jest.fn()
        .mockRejectedValue(readConfigError) as unknown as ContextPayloadPushAuthenticated['config'],
    };
    const context = mockedContext as unknown as ContextPayloadPushAuthenticated;

    await expectSaga(
      readRepoConfigSaga,
      context,
    )
      .returns(defaultConfig)
      .run(false);

    expect(context.log.error).toHaveBeenCalledWith(
      {
        ...getLogInfo(context),
        err: readConfigError,
      },
      'Can\'t get config',
    );
  });
});
