import validate from './validators';
import validOhlgUiData from '../../utils/fixtures/omicron-hospitality-leisure/fromUI';
import invalidOhlgUiData from '../../utils/fixtures/omicron-hospitality-leisure/invalidUI.json';
import validOhlgApiData from '../../utils/fixtures/omicron-hospitality-leisure/toAPI';

describe('validator', () => {
  it('validates OHLG and validation outputs what the API expects', async () => {
    try {
      const result = await validate(validOhlgUiData);
      expect(result).toEqual(validOhlgApiData);
    } catch (e) {
      throw e.message;
    }
  });

  it('fails to validate invalid UI data for OHLG', async () => {
    try {
      await validate(invalidOhlgUiData);
    } catch (e) {
      expect(e.message).toEqual(
        'eligibilityCriteria.eligibleForOhlg is a required field'
      );
    }
  });
});
