import { getGrantBySlug } from './grants';

describe('grants', () => {
  describe('#getGrantBySlug', () => {
    it('should throw if an unknown slug is proviuded', () => {
      expect(() => getGrantBySlug('unknown-grant')).toThrow();
    });

    it('should return a grant with a valid slug', () => {
      const { name } = getGrantBySlug('arg-3');

      expect(name).toEqual(expect.any(String));
    });
  });
});
