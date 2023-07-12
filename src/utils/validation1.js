import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must at least have 6 characters').required('Password is required'),
  //mobileNumber: Yup.string().required('Mobile Number is required'),
});
