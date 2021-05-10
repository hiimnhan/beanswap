import * as yup from 'yup';
import { checkValidPhoneNumber } from '../utils/format.utils';

export const employeeInfoSchema = yup.object().shape({
  employeeCode: yup.string().required('Code is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phoneNumber: yup
    .string()
    .required('phone number is required')
    .test('is-phone', 'Not a valid phone number', (value) =>
      checkValidPhoneNumber(value)
    ),
  address: yup.string().required('Address is required'),
  email: yup.string().email().required('Email is required'),
});

export const checkUserSchema = yup.object().shape({
  emailCheck: yup.string().email().required('Email is required'),
  phoneNumberCheck: yup
    .string()
    .required('Phone number is required')
    .test('is-phone', 'Not a valid phone number', (value) =>
      checkValidPhoneNumber(value)
    ),
});

export const storeSchema = yup.object().shape({
  code: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
});
