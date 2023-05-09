import makeHttpPostRequest from '../common/makeHttpPostRequest';

export const RetriggerValidations = async (e) => {
  const clientId = '8645f8b0-5573-4926-8f7b-7b114f36d45b';
  const secret = 'feab5697-911b-41b9-9282-f1011e3cba13';
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
    const hostname = 'api.x.flatfile.com';
    const protocol = 'https';
    await makeHttpPostRequest({
      url: validateUrl,
      body,
      token: apiToken.data?.accessToken,
      hostname,
      protocol,
    });
    console.log('Successfully made http request to: ' + validateUrl);
  } catch (error) {
    console.log(`NodeHttpsAction[error]: ${JSON.stringify(error, null, 2)}`);
  }
};
