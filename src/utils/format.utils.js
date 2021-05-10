import { split } from 'lodash';
import {
  isValidPhoneNumber,
  AsYouType,
  parsePhoneNumber,
} from 'libphonenumber-js';
import { CONVERT_RATE } from '../constants/format';
export const getFirstLetter = (text) => {
  const spilitingText = split(text, ' ');
  const firstLetters = spilitingText.map((e) => e.substr(0, 1));
  const [firstLetter] = [...firstLetters];
  let [lastLetter] = [...firstLetters].reverse();
  if (!/[a-zA-Z]/g.test(lastLetter)) {
    firstLetters.pop();
    [lastLetter] = [...firstLetters].reverse();
  }

  return [firstLetter, lastLetter].join('');
};

export const checkValidPhoneNumber = (text, country = 'VN') => {
  return isValidPhoneNumber(text, country);
};

export const formatPhoneNum = (text, country = 'VN') => {
  return new AsYouType(country).input(text);
};

export const parsePhoneNum = (text, country = 'VN') => {
  const phoneNum = parsePhoneNumber(text, country);
  return phoneNum.number;
};

export const normalizePhoneNumber = (text, countryPrefix, replaceText) => {
  return text.replace(countryPrefix, replaceText);
};

export const convertUSDBean = (value, isUSD) => {
  return isUSD ? value / CONVERT_RATE : value * CONVERT_RATE;
};

export const numberFormat = (number) => {
  const formatted = new Intl.NumberFormat('de-DE').format(number);
  return formatted;
};

export const currencyFormat = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-EN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
