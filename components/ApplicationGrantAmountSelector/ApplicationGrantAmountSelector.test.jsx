import { handleOnChange, handleSubmit } from './ApplicationGrantAmountSelector';

describe('<ApplicationGrantAmountSelector>', () => {
  describe('handleSubmit()', () => {
    it('Patches the grant application', async () => {
      const grantApplicationPatcherSpy = jest.fn();
      const setErrorSpy = jest.fn();
      const onChangeSpy = jest.fn();
      const setSuccessMessageSpy = jest.fn();

      const value = 'Other';
      const customValue = 25565.0;
      const applicationId = 1;
      const storeAs = 'additionalRestrictionsGrant';
      const grantAmountAwarded = 25565;
      await handleSubmit(
        value,
        customValue,
        grantApplicationPatcherSpy,
        applicationId,
        storeAs,
        setErrorSpy,
        onChangeSpy,
        setSuccessMessageSpy
      );
      expect(grantApplicationPatcherSpy).toHaveBeenCalledWith(applicationId, {
        [storeAs]: grantAmountAwarded,
      });
    });

    it('Sets the error to be the received error message if the change fails to validate', async () => {
      const validationErrorMessage = 'Validation error';
      const grantApplicationPatcherSpy = jest.fn(() => {
        throw {
          response: {
            data: validationErrorMessage,
          },
        };
      });
      const value = 100.0;
      const customValue = null;
      const setErrorSpy = jest.fn();
      const onChangeSpy = jest.fn();

      const setSuccessMessageSpy = jest.fn();

      const applicationId = 1;
      const storeAs = 'additionalRestrictionsGrant';
      await handleSubmit(
        value,
        customValue,
        grantApplicationPatcherSpy,
        applicationId,
        storeAs,
        setErrorSpy,
        onChangeSpy,
        setSuccessMessageSpy
      );

      expect(setErrorSpy).toHaveBeenCalledWith(validationErrorMessage);
    });

    it('Unsets the error if successful', async () => {
      const grantApplicationPatcherSpy = jest.fn();
      const onChangeSpy = jest.fn();
      const setErrorSpy = jest.fn();
      const setSuccessMessageSpy = jest.fn();

      const value = 100.0;
      const customValue = 0;
      const applicationId = 1;
      const storeAs = 'additionalRestrictionsGrant';
      await handleSubmit(
        value,
        customValue,
        grantApplicationPatcherSpy,
        applicationId,
        storeAs,
        setErrorSpy,
        onChangeSpy,
        setSuccessMessageSpy
      );

      expect(setErrorSpy).toHaveBeenCalledTimes(1);
      expect(setErrorSpy).toHaveBeenCalledWith(false);
    });

    it('Shows success message if successful', async () => {
      const grantApplicationPatcherSpy = jest.fn();
      const onChangeSpy = jest.fn();
      const setErrorSpy = jest.fn();
      const setSuccessMessageSpy = jest.fn();

      const value = 100.0;
      const customValue = 0;
      const applicationId = 1;
      const storeAs = 'additionalRestrictionsGrant';
      await handleSubmit(
        value,
        customValue,
        grantApplicationPatcherSpy,
        applicationId,
        storeAs,
        setErrorSpy,
        onChangeSpy,
        setSuccessMessageSpy
      );

      expect(setSuccessMessageSpy).toHaveBeenCalledTimes(1);
      expect(setSuccessMessageSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('handleOnChange()', () => {
    it('Sets the value to the awarded grant amount', async () => {
      const setValueSpy = jest.fn();
      const setCustomValueVisibleSpy = jest.fn();
      const setErrorSpy = jest.fn();
      const setSuccessMessageSpy = jest.fn();

      const grantAmountAwarded = '25565.0';
      await handleOnChange(
        setErrorSpy,
        setValueSpy,
        setCustomValueVisibleSpy,
        setSuccessMessageSpy
      )(grantAmountAwarded);

      expect(setValueSpy).toHaveBeenCalledWith(grantAmountAwarded);
    });

    it('Shows customValue input if Other selected', async () => {
      const setValueSpy = jest.fn();
      const setErrorSpy = jest.fn();
      const setCustomValueVisibleSpy = jest.fn();
      const setSuccessMessageSpy = jest.fn();

      const grantAmountAwarded = 'Other';
      await handleOnChange(
        setErrorSpy,
        setValueSpy,
        setCustomValueVisibleSpy,
        setSuccessMessageSpy
      )(grantAmountAwarded);

      expect(setCustomValueVisibleSpy).toHaveBeenCalledTimes(1);
      expect(setCustomValueVisibleSpy).toHaveBeenCalledWith(true);
    });

    it('Hides success message on value change', async () => {
      const setValueSpy = jest.fn();
      const setErrorSpy = jest.fn();
      const setCustomValueVisibleSpy = jest.fn();
      const setSuccessMessageSpy = jest.fn();

      const grantAmountAwarded = 'Other';
      await handleOnChange(
        setErrorSpy,
        setValueSpy,
        setCustomValueVisibleSpy,
        setSuccessMessageSpy
      )(grantAmountAwarded);

      expect(setSuccessMessageSpy).toHaveBeenCalledTimes(1);
      expect(setSuccessMessageSpy).toHaveBeenCalledWith(false);
    });
  });
});
