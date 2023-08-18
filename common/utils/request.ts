import { FlatfileEvent } from '@flatfile/listener';
import axios from 'axios';

export const post = async ({
  path,
  body,
  event,
}: {
  path: string;
  body: any;
  event: FlatfileEvent;
}) => {
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('Missing API_BASE_URL');
  }

  try {
    const response = await axios.post(`${apiBaseUrl}}${path}`, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-server-auth': await event.secrets('SERVER_AUTH_TOKEN'),
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error('HTTP call was not a success');
    }
  } catch (error) {
    console.error(`Fetch error: ${JSON.stringify(error, null, 2)}`);
    throw new Error('HTTP call failed');
  }
};

export const get = async ({
  path,
  params,
  event,
}: {
  path: string;
  params: any;
  event: FlatfileEvent;
}) => {
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('Missing API_BASE_URL');
  }

  try {
    const response = await axios.get(`${apiBaseUrl}${path}`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        'x-server-auth': await event.secrets('SERVER_AUTH_TOKEN'),
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error('HTTP call was not a success');
    }
  } catch (error) {
    console.error(`Fetch error: ${JSON.stringify(error, null, 2)}`);
    throw new Error('HTTP call failed');
  }
};
