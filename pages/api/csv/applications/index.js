import * as HttpStatus from 'http-status-codes';
import AppContainer from '../../../../containers/AppContainer';

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      try {
        const grantType = req.query.grantType;
        if (!grantType) {
          throw new Error("Missing 'grantType' parameter");
        }

        const container = AppContainer.getInstance();
        const listApplicationsCSV = container.getListApplicationsCSV();
        res.statusCode = HttpStatus.OK;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'filename=data.csv');
        const csvResult = await listApplicationsCSV({
          grantType,
        });
        res.end(csvResult.csvString);
      } catch (error) {
        console.log('Applications CSV error:', error);
        res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        res.end(JSON.stringify('Unable to generate an applications CSV'));
      }
      break;

    default:
      res.statusCode = HttpStatus.BAD_REQUEST;
      res.end(JSON.stringify('Invalid request method'));
  }
};
