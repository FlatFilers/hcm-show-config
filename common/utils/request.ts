import axios from 'axios';

export const post = async ({
  path,
  body,
  headers,
}: {
  path: string;
  body: any;
  headers;
}) => {
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('Missing API_BASE_URL');
  }

  try {
    const response = await axios.post(`${apiBaseUrl}${path}`, body, {
      headers,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.error(JSON.stringify(response, null, 2));
      throw new Error(`HTTP call to ${path} was not a success`);
    }
  } catch (error) {
    console.error(`Fetch error to ${path}: ${JSON.stringify(error, null, 2)}`);
    throw new Error(`HTTP call to ${path} failed`);
  }
};

export const get = async ({
  path,
  params,
  headers,
}: {
  path: string;
  params: any;
  headers: any;
}) => {
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('Missing API_BASE_URL');
  }

  try {
    const response = await axios.get(`${apiBaseUrl}${path}`, {
      params,
      headers,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`HTTP call to ${path} was not a success`);
    }
  } catch (error) {
    console.error(`Fetch error for ${path}: ${JSON.stringify(error, null, 2)}`);
    throw new Error(`HTTP call to ${path} failed`);
  }
};
