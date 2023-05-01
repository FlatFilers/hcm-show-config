import makeHttpPostRequest from '../../../validations-plugins/common/makeHttpPostRequest';
import { Action } from '@flatfile/configure';
const testParams = {
  url: '/v1/auth/access-token',
  clientId: process.env.clientId,
  secret: process.env.secret,
};
export const RetriggerValidations = async (e) => {
  const { clientId, secret, endpoint } = process.env;
  const { workbookId, sheetId } = e.context;
  try {
    const body = {
      clientId,
      secret,
    };
    if (!clientId || !secret) return;
    const validateUrl = `/v1/workbooks/${workbookId}/sheets/${sheetId}/validate`;
    const apiToken = await e.api.getAccessToken({
      apiCredentials: {
        clientId,
        secret,
      },
    });
    const protocol = endpoint?.split('//')[0];
    const pathname = endpoint?.split('//')[1];
    const hostname = pathname?.split(':')[0];
    const port = pathname?.split(':')[1];
    await makeHttpPostRequest({
      url: validateUrl,
      body,
      token: apiToken.data?.accessToken,
      hostname,
      protocol,
      port,
    });
    console.log('Successfully made http request to: ' + validateUrl);
  } catch (error) {
    console.log(`NodeHttpsAction[error]: ${JSON.stringify(error, null, 2)}`);
  }
};
