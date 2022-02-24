import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export const getUserFromCookie = (cookie) => {
  const { hackneyToken } = parse(cookie);

  const decodedToken = jwt.decode(hackneyToken);

  if (!decodedToken) {
    throw new Error('Unable to decode JWT');
  }

  return decodedToken;
};

export const getUserStringFromCookie = (cookie) => {
  if (!cookie) {
    return 'User unknown';
  }

  const user = getUserFromCookie(cookie);

  return `${user.name} <${user.email}>`;
};

export const userInAllowedGroup = (userGroups) => {
  const allowedGroups = process.env.ALLOWED_GROUPS.split(',');
  return (
    userGroups &&
    (userGroups.some((g) => allowedGroups.includes(g)) ||
      userGroups.includes(process.env.CSV_DOWNLOAD_GROUP))
  );
};

export const redirectIfNotAuth = async ({ req, query }) => {
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

    return {
      props: {},
      redirect: {
        permanent: false,
        destination: `${process.env.HACKNEY_AUTH_URL}?redirect_uri=${
          process.env.HTTPS_ENABLED === 'true' ? 'https://' : 'http://'
        }${process.env.APP_DOMAIN + req.url}`,
      },
    };
  }
};
