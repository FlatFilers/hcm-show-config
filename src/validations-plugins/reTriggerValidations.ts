import makeHttpPostRequest from '../validations-plugins/common/makeHttpPostRequest';
import { Action } from '@flatfile/configure';
const testParams = {
  url: '/v1/auth/access-token',
  clientId: process.env.clientId,
  secret: process.env.secret,
};
const RetriggerValidations = new Action(
  {
    slug: 'RetriggerValidations',
    label: 'Re-run Validations',
    description: 'Re-run validations on this sheet',
  },
  async (e) => {
    const { workbookId, sheetId } = e.context;
    try {
      const body = {
        clientId: testParams.clientId,
        secret: testParams.secret,
      };
      const validateUrl = `/v1/workbooks/${workbookId}/sheets/${sheetId}/validate`;
      const apiToken = await e.api.getAccessToken({
        getAccessTokenRequest: {
          clientId: testParams.clientId,
          secret: testParams.secret,
        },
      });
      const response = await makeHttpPostRequest({
        url: validateUrl,
        body,
        token: apiToken.data?.accessToken,
      });
      console.log(`response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.log(`NodeHttpsAction[error]: ${JSON.stringify(error, null, 2)}`);
    }
  }
);
export default RetriggerValidations;
