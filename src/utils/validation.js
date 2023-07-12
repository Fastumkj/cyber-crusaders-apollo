import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  //username: Yup.string().required('Username is required'),
  password: Yup.string().min(6, 'Password must at least have 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  //mobileNumber: Yup.string().required('Mobile Number is required'),
});
