export type WorkflowEnvironment = 'production' | 'dev';
export type WorkflowType = 'onboarding' | 'filefeed' | 'embedded' | 'dynamic';

type WorkflowTypeConfig = {
  [key in WorkflowType]: {
    apiKey: string;
    environmentId: string;
  };
};

export type WorkflowEnv = {
  [key in WorkflowEnvironment]: WorkflowTypeConfig & {
    apiBaseUrl: string;
  };
};
