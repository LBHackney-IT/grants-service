import * as HttpStatus from 'http-status-codes';
import { customAlphabet } from 'nanoid';
import AppContainer from '../../../containers/AppContainer';
import { getUserStringFromCookie } from '../../../utils/auth';
import {
  PAGE_MUST_BE_AT_LEAST_ONE,
  PAGINATED_PAST_END,
} from '../../../lib/usecases/listApplications';
import uploadApplication from '../../../lib/usecases/uploadApplication';
import isValidApplication from '../../../lib/usecases/validators';
import sendConfirmationEmail from '../../../lib/usecases/sendConfirmationEmail';
import { addDays } from 'date-fns';

export default async (req, res) => {
  const rightNow = new Date();

  // TODO: fix this to use the expiration date from the grant type configuration
  const lastSubmission = addDays(rightNow, 1);

  switch (req.method) {
    case 'GET':
      try {
        const container = AppContainer.getInstance();
        const listApplications = container.getListApplications();
        res.setHeader('Content-Type', 'application/json');

        if (!req.query.grantType) {
          throw new Error("Missing 'grantType' query parameter");
        }

        const grantType = req.query.grantType as string;

        const currentPage =
          req.query && req.query.page
            ? parseInt(req.query.page, 10)
            : undefined;
        const pageSize =
          req.query && req.query.pageSize
            ? parseInt(req.query.pageSize, 10)
            : undefined;
        const sort = req.query && req.query.sort ? req.query.sort : undefined;
        const status =
          req.query && req.query.status ? req.query.status : undefined;
        const searchTerm =
          req.query && req.query.searchTerm ? req.query.searchTerm : undefined;

        const businessCategory =
          req.query && req.query.businessCategory
            ? req.query.businessCategory
            : undefined;

        const businessSize =
          req.query && req.query.businessSize
            ? req.query.businessSize
            : undefined;

        const businessPremises =
          req.query && req.query.businessPremises
            ? req.query.businessPremises
            : undefined;

        const date = req.query && req.query.date ? req.query.date : undefined;

        const grantOfficer =
          req.query && req.query.grantOfficer
            ? req.query.grantOfficer
            : undefined;

        const clientGeneratedId =
          req.query && req.query.applicationId
            ? req.query.applicationId
            : undefined;

        const listApplicationsResponse = await listApplications({
          grantType,
          currentPage,
          pageSize,
          sort,
          status,
          businessCategory,
          grantOfficer,
          clientGeneratedId,
          businessSize,
          businessPremises,
          date,
          searchTerm,
        });
        if (
          [PAGE_MUST_BE_AT_LEAST_ONE, PAGINATED_PAST_END].includes(
            listApplicationsResponse.error
          )
        ) {
          res.statusCode = HttpStatus.BAD_REQUEST;
        } else {
          res.statusCode = HttpStatus.OK;
        }
        res.end(JSON.stringify(listApplicationsResponse));
      } catch (error) {
        console.log('Application list error:', error);
        res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        res.end(JSON.stringify('Unable to list applications'));
      }
      break;

    case 'POST':
      if (rightNow >= lastSubmission) {
        res.statusCode = HttpStatus.FORBIDDEN;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Applications have closed.' }));
        break;
      }

      try {
        const nanoid = customAlphabet(
          '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz0123456789',
          21
        );
        const clientGeneratedId = nanoid();
        const validApplication = await isValidApplication(req.body);
        await uploadApplication(
          clientGeneratedId,
          req.body.grantType,
          validApplication
        );
        await sendConfirmationEmail(
          clientGeneratedId,
          req.body.contact.emailAddress
        );
        res.statusCode = HttpStatus.CREATED;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(clientGeneratedId));
      } catch (error) {
        console.log('Application submission error:', error);
        // Todo: We should 400 on invalid application and 500 on Internal Server Error
        res.statusCode = HttpStatus.BAD_REQUEST;
        res.end(JSON.stringify(error.message));
      }
      break;

    default:
      res.statusCode = HttpStatus.BAD_REQUEST;
      res.end(JSON.stringify('Invalid request method'));
  }
};
