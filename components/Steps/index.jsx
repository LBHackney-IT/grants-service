import { steps as ohlgSteps } from './omicron-hospitality-leisure-grant';
import { steps as argSteps } from './additional-restrictions-grant';

import { inputLabels as ohlgInputLabels } from './omicron-hospitality-leisure-grant';
import { inputLabels as argInputLabels } from './additional-restrictions-grant';

export const stepKeys = (grantType) => {
  if (grantType == 'ohlg') return Object.keys(ohlgSteps);
  if (grantType == 'arg') return Object.keys(argSteps);

  console.log(`Grant Type ${grantType} not found`);
  throw new Error(`Grant Type ${grantType} not found`);
};

const inputLabels = (grantType) => {
  if (grantType == 'ohlg') return ohlgInputLabels;
  if (grantType == 'arg') return argInputLabels;

  console.log(`Grant Type ${grantType} not found`);
  throw new Error(`Grant Type ${grantType} not found`);
};

export const hasAdminValidation = (form, name, grantType) => {
  return (
    inputLabels(grantType)[form][name] &&
    inputLabels(grantType)[form][name].adminValidation
  );
};

export const getQuestionText = (grantType, section, question) => {
  const grantInputs = inputLabels(grantType);
  return grantInputs[section][question].label;
};
