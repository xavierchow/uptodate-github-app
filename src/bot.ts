import {
  Context,
} from 'probot';

import {
  WebhookPayloadPush,
} from '@octokit/webhooks';

import {
  Application,
} from './entities/Application';

import {
  isDefaultBranchUpdated,
} from './entities/eventPayloads';

import {
  repositoryUpdated,
} from './actions/updateRepository';

export = (app: Application) => {
  app.on('push', async (context: Context<WebhookPayloadPush>) => {
    if (!isDefaultBranchUpdated(context)) {
      return;
    }

    const action = repositoryUpdated(
      context.payload.repository,
      context,
    );
    app.store.dispatch(action);
  });
};
