import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { validationSchema } from '../utils/validation.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../utils/firebase.js";
import formbackground from '../assets/formbackground.jpg';


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
    <section className="vh-100" style={{ fontFamily: 'Chakra Petch, sans-serif' }}>
      <div
        className="background-container"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          backgroundImage: `url(${formbackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right',
          overflow: "hidden",
        }}
      >
        <div
          className="white-overlay"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            backgroundColor: 'white',
          }}
        ></div>
        <div className="container-fluid">
        <div style={{ marginRight: '-15%' }}>
          <div className="row justify-content-end">
            <div className="col-sm-6 text-black" >
              <div className="px-5 ms-xl-4">
              <div class="stars me-3 pt-5 mt-xl-4" style={{ marginLeft: "-2%"}}>
                <div class="star">
                  <div class="planet"></div>
                  <div></div>
                  <div></div>
                </div>
                <div class="star">
                  <div class="planet"></div>
                  <div></div>
                  <div></div>
                </div>
                <div class="star">
                  <div class="planet"></div>
                  <div></div>
                  <div></div>
                </div>
                <div class="star">
                  <div class="planet"></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
                <span 
                  className="h1 fw-bold mb-0 ml-2"
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    color: '#003eff', // Purple color for the text
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Text shadow effect
                  }}
                  
                  
                >
                  SIGN UP ACCOUNT
                </span>
              </div>

              <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
                <form style={{ width: '23rem' }} onSubmit={formik.handleSubmit}>
                  <h3
                    className="fw-normal mb-3 pb-3"
                    style={{
                      background: 'linear-gradient(120deg, #9f8bf3, #ff9100)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transition: 'color 0.3s ease-in-out',
                    }}
                  >
                    {catchline}
                  </h3>

                    <form onSubmit={formik.handleSubmit} style={{ background: 'transparent', border: 'none' }}></form>
                        <div className="form-outline mb-4">
                        <label htmlFor="email" className="font-weight-regular" style={{ color:'black' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="form2Example18"
                            className="form-control form-control-lg"
                            placeholder="Email address"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ marginTop: '5px' }}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <span className="text-danger font-weight-regular">{formik.errors.email}</span>
                        )}
                    </div>

                    <div className="form-outline mb-4">
                        <label htmlFor="password" className="font-weight-regular" style={{ color:'black' }}>
                            Password
                        </label>
                        <input
                        type="password"
                        id="form2Example28"
                        className="form-control form-control-lg"
                        placeholder="Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && (
                        <span className="text-danger font-weight-regular">{formik.errors.password}</span>
                        )}
                    </div>

                    <div className="form-outline mb-4">
                        <label htmlFor="confirmPassword" className="font-weight-regular" style={{ color:'black' }}>
                            Confirm Password
                        </label>
                        <input
                        type="password"
                        id="form2Example28"
                        className="form-control form-control-lg"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <span className="text-danger font-weight-regular">{formik.errors.confirmPassword}</span>
                        )}
                    </div>

                  <div className="pt-1 mb-2">
                  <input
                        id="submitbutton"
                        type="submit"
                        name="submit"
                        value="Submit"
                        className="btn btn-primary"
                        autoComplete="off"
                    />
                    <input
                        id="resetbutton"
                        type="reset"
                        name="reset"
                        value="Reset"
                        style={{ marginLeft: '10px' }}
                        className="btn btn-secondary"
                        autoComplete="off"
                        onClick={handleReset} 
                    />
                  </div>


                  <p style={{ color: 'black' }}>
                    Already have an account?
                    <Link to="/login" className="link-info" style={{ marginLeft: '5px' }}>
                      Login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
