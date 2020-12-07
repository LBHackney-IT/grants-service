import * as HttpStatus from 'http-status-codes';
import { parse } from 'cookie';
import jsonwebtoken from 'jsonwebtoken';

export const getUserFromCookie = (cookie) =>
  jsonwebtoken.decode(parse(cookie).hackneyToken);

export const getUserStringFromCookie = (cookie) => {
  if (!cookie) {
    return 'User unknown';
  }
  const user = getUserFromCookie(cookie);
  return `${user.name} <${user.email}>`;
};

export const redirectIfNotAuth = async ({ req, res, query }) => {
  try {
    return {
      props: {
        csvDownloadGroup: process.env.CSV_DOWNLOAD_GROUP,
        ...getUserFromCookie(req.headers.cookie),
        ...query,
      },
    };
  } catch (e) {
    console.error(e.message);
  }
  res.writeHead(HttpStatus.MOVED_TEMPORARILY, {
    Location: `${process.env.HACKNEY_AUTH_URL}?redirect_uri=https://${
      process.env.URL_PREFIX + req.url
    }`,
  });
  res.end();
  return {};
};
