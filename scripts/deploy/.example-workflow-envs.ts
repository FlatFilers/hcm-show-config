import { WorkflowEnv } from './update-env';

const workflowEnvs: WorkflowEnv = {
  production: {
    onboarding: {
      apiKey: 'sk_...',
      environmentId: 'us_env_...',
    },
    filefeed: {
      apiKey: 'sk_...',
      environmentId: 'us_env_...',
    },
    embedded: {
      apiKey: 'sk_...',
      environmentId: 'us_env_...',
    },
    dynamic: {
      apiKey: 'sk_...',
      environmentId: 'us_env_...',
    },
  },
  dev: {
    onboarding: {
      apiKey: 'sk_...',
      environmentId: 'us_env_...',
    },
    filefeed: {
      apiKey: 'sk_...',
      environmentId: 'us_env_...',
    },
    embedded: {
      apiKey: 'sk_...',
      environmentId: 'us_env_...',
    },
    dynamic: {
      apiKey: 'sk_...',
      environmentId: 'us_env_...',
    },
  },
};

export default workflowEnvs;
