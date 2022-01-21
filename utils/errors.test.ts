import { convertErrorToStatusCode, NotFoundError } from './errors';

describe('custom errors', () => {
  describe('#convertErrorToStatusCode()', () => {
    it('should return 404 if a NotFoundError is provided', () => {
      expect(convertErrorToStatusCode(new NotFoundError('Not found'))).toEqual(
        404
      );
    });
  });
});
