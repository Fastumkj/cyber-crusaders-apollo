import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { validationSchema } from '../utils/validation.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../utils/firebase.js";
import gifBackground from '../assets/gifBackground.gif';


const catchlines = ['Join us today!', 'Unlock exclusive benefits!', 'Discover a new world!', 'Experience the future!', 'Level up your journey!'];

const SignUp = () => {

  const navigate = useNavigate(); //Get the navigate function from react-router

  const [catchline, setCatchline] = useState('');

  useEffect(() => {
    const randomCatchline = catchlines[Math.floor(Math.random() * catchlines.length)];
    setCatchline(randomCatchline);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await handleSignUp(values);
        console.log("Signed up!");
        console.log("email is: " + values.email);
        console.log("password is: " + values.password);
        navigate('/login');
      } catch (error) {
        console.log('Sign-up error', error);
        // Handle login error, display error message, etc.
      }
    },
  });

  const handleReset = () => {
    formik.resetForm();
  };
  
  const handleSignUp = async (values) => {
    try {
      // Call Firebase createUserWithEmailAndPassword method
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      console.log('Sign up successful!');
      console.log("Account created!");
      // Redirect or perform other actions after successful login
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        formik.setFieldError('email', 'Email already exists');
      } else {
        console.log('Sign-up error:', error);
      // Handle login error, display error message, etc.
      }
      throw error; //Rethrow the error to prevent form submission
    }
  };

  return (
    <div className="signUpContainer" style={{ width: '100vw', height: '100vh', backgroundImage: `url(${gifBackground})`, backgroundSize: 'cover', overflow: 'hidden' }}>
      <h1 className="text-green text-center font-weight-bold" style={{ color: 'floralwhite', fontSize: '40px', background: 'transparent', fontFamily: 'Arial, sans-serif', letterSpacing: '2px', textShadow: '2px 2px 4px #00ccff, 4px 4px 6px #0066cc' }}>
        FORM SIGN UP
      </h1>

      <h4 className="text-blue text-center font-weight-bold" style={{ color: 'floralwhite', fontSize: '40px', background: 'transparent' }}>
        {catchline}
      </h4>

      <div className="sign-up-container" style={{ backgroundColor: 'transparent', marginTop: '80px' }}>
        <br />

        <div className="col-lg-5 m-auto d-block" style={{ backgroundColor: 'black', borderRadius: '10px', opacity: '0.6' }}>
          <form onSubmit={formik.handleSubmit} style={{ background: 'transparent', border: 'none' }}>
            <div className="form-group" style={{ backgroundColor: 'transparent' }}>
              <label htmlFor="name" className="font-weight-regular" style={{ color:'floralwhite', backgroundColor: 'transparent' }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder = "Enter your name..."
                id="name"
                autoComplete="off"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength={25}
              />
              {formik.touched.name && formik.errors.name && (
                <span className="text-danger font-weight-regular">{formik.errors.name}</span>
              )}
            </div>

            <div className="form-group" style={{ backgroundColor: 'transparent' }}>
              <label htmlFor="email" className="font-weight-regular" style={{ color:'floralwhite', backgroundColor: 'transparent' }}>
                Email
              </label>
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder = "Enter your email..."
                id="email"
                autoComplete="off"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-danger font-weight-regular">{formik.errors.email}</span>
              )}
            </div>

            <div className="form-group" style={{ backgroundColor: 'transparent' }}>
              <label htmlFor="password" className="font-weight-regular" style={{ color:'floralwhite', backgroundColor: 'transparent' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder = "Enter your password..."
                id="password"
                autoComplete="off"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="text-danger font-weight-regular">{formik.errors.password}</span>
              )}
            </div>

            <div className="form-group" style={{ backgroundColor: 'transparent' }}>
              <label htmlFor="confirmPassword" className="font-weight-regular" style={{ color:'floralwhite', backgroundColor: 'transparent' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder = "Enter your password..."
                id="confirmPassword"
                autoComplete="off"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <span className="text-danger font-weight-regular">{formik.errors.confirmPassword}</span>
              )}
            </div>

            <input
              type="submit"
              name="submit"
              value="Submit"
              className="btn btn-primary"
              autoComplete="off"
            />
            <input
              type="reset"
              name="reset"
              value="Reset"
              className="btn btn-secondary"
              autoComplete="off"
              onClick={handleReset} 
            />
          </form>
          <br></br>
          <div style={{ color:'floralwhite', backgroundColor: 'transparent' }}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
