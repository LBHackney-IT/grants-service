import { NotFoundError } from '../utils/errors';
import { getGrantBySlug } from './grants';

describe('grants', () => {
  describe('#getGrantBySlug', () => {
    it('should throw if an unknown slug is proviuded', () => {
      expect(() => getGrantBySlug('unknown-grant')).toThrow(NotFoundError);
    });

    it('should return a grant with a valid slug', () => {
      const { name } = getGrantBySlug('arg');

      expect(name).toEqual(expect.any(String));
    });
  });
});
