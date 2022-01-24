import { NextApiHandler } from 'next';

const handler: NextApiHandler = (req, res) => {
  const shouldUseLocalStorage = process.env.ENV === 'local' ? true : false;

  if (!shouldUseLocalStorage) {
    // This route doesn't exist in non-local environments, so return a 404
    res.statusCode = 404;
    res.end();
    return;
  }

  // At the moment, we don't particularly care about what is uploaded, we just want to return a nice 200 HTTP response
  res.end();
};

export default handler;
