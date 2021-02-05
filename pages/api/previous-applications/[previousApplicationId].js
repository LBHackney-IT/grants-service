import * as HttpStatus from 'http-status-codes';
import { APPLICATION_NOT_FOUND } from '../../../lib/constants';

import getPreviousApplication from '../../../lib/usecases/getPreviousApplication';

export default async (req, res) => {
  const previousApplicationId = req.query.previousApplicationId;

  switch (req.method) {
    case 'GET':
      try {
        res.setHeader('Content-Type', 'application/json');
        let previousApplication = await getPreviousApplication(
          previousApplicationId
        );
        if (previousApplication.error === APPLICATION_NOT_FOUND) {
          res.statusCode = HttpStatus.NOT_FOUND;
        } else {
          res.statusCode = HttpStatus.OK;
        }
        res.end(JSON.stringify(previousApplication));
      } catch (error) {
        console.log('Application details error:', error, 'request:', req);
        res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        res.end(JSON.stringify('Unable to get application details'));
      }
      break;

    default:
      res.statusCode = HttpStatus.BAD_REQUEST;
      res.end(JSON.stringify('Invalid request method'));
  }
};
