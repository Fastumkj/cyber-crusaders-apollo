import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { validationSchema } from '../utils/validation1.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../utils/firebase.js";
import ReCAPTCHA from "react-google-recaptcha";
import formbackground from '../assets/formbackground.jpg';
import { color } from 'framer-motion';

const catchlines = ['Welcome back!', 'Ready to explore?', 'Let the adventure begin!', 'Unleash your inner astronaut.', 'Start your journey!', 'Ignite your interstellar adventure!'];

const LoginForm = ({ onLogin, isLoggedIn }) => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const recaptchaRef = React.createRef();
  const [catchline, setCatchline] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); // New state variable to track login process

  useEffect(() => {
    const randomCatchline = catchlines[Math.floor(Math.random() * catchlines.length)];
    setCatchline(randomCatchline);
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!isLoggingIn) { // Check if login is already in progress
        try {
          setIsLoggingIn(true); // Set login state to true
          await handleLogin(values.email, values.password);
          console.log("Logged in!");
        } catch (error) {
          console.log('Login error:', error);
          alert("Incorrect email or password. Please try again.");
        } finally {
          setIsLoggingIn(false); // Reset login state to false
        }
      }
    },
  });

  const handleLogin = async (email, password) => {
    try {
      // Call Firebase signInWithEmailAndPassword method
      await signInWithEmailAndPassword(auth, email, password);

      console.log('Login successful!');
      alert("Logged in!"); //delete once deployed
      onLogin();
      navigate('/home');
      // Redirect or perform other actions after successful login
    } catch (error) {
      console.log('Login error:', error);
    }
  };

  if (isLoggedIn) {
    navigate('/home');
    return null;
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  // Handle Recaptcha logic 
  const handleRecaptchaVerify = (response) => {
    setRecaptchaVerified(true);
    console.log("Recaptcha verified");
  }

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
        }}
      >
      <div
        className="white-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          backgroundColor: 'white',
        }}
      ></div>
      <div className="container-fluid" style={{ marginLeft: '10%' }}>
        <div className="row">
          <div className="col-sm-6 text-black">
            <div className="px-5 ms-xl-4">
            <i className="fas fa-space-shuttle fa-2x me-3 pt-5 mt-xl-4" 
              style={{
                background: 'linear-gradient(90deg, #0000ff, #ffffff)', // Strong blue and white gradient background
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginLeft: '-50px',
              }}></i>
              <span className="h1 fw-bold mb-0 ml-2" 
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: '#003eff', // Purple color for the text
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Text shadow effect
              }}>CyberCrusaders</span>
            </div>

            <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
              <div style={{marginTop: '20%'}}></div>
              <form style={{ width: '23rem' }} onSubmit={formik.handleSubmit}>
                <h3 className="fw-normal mb-3 pb-3" style={{
                  background: 'linear-gradient(120deg, #9f8bf3, #ff9100)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transition: 'color 0.3s ease-in-out'
                }}>{catchline}</h3>

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
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className="text-danger font-weight-regular">{formik.errors.email}</span>
                  )}
                </div>

                <div className="form-outline mb-4">
                  <label htmlFor="email" className="font-weight-regular" style={{ color:'black' }}>
                    Password
                  </label>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
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
                  <span className="password-toggle" style={{ backgroundColor: 'white' }} onClick={togglePasswordVisibility}>
                    {passwordVisible ? <i className="fa fa-eye-slash" style={{ color: 'gold' }} ></i> : <i className="fa fa-eye" style={{ color: 'gold' }}></i>}
                  </span>
                </div>

                {/* ReCAPTCHA */}
                <div style={{ backgroundColor: 'transparent', border: 'none' }}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LccIrkmAAAAAEYXpCBt4AOitCid97jFauP1cZa0"
                    onChange={handleRecaptchaVerify}
                    style={{ display: 'inline-block' }}
                  />
                </div>

                <div className="pt-1 mb-4">
                  <button
                    className="btn btn-info btn-lg btn-block"
                    type="submit"
                    style={{ backgroundColor: 'green', width: '33%' }}
                    onClick={(e) => {
                      if (!recaptchaVerified) {
                        e.preventDefault();
                        alert("Please verify reCaptcha, are you a robot sent by space?");
                      }
                    }}
                  >
                    Login
                  </button>
                </div>
                <p style={{ color: 'black' }}>Don't have an account?<Link to="/signup" className="link-info" style={{ marginLeft: '5px' }}>Register here</Link></p>
              </form>
            </div>
          </div>
          </div>
          </div>
        </div>
    </section>
  );
};

export default LoginForm;
