import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode from jwt-decode, not jwt_decode
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const initialValues = {
    email: '',
    password: '',
  };

  const onSubmit = (values, { setSubmitting, setErrors }) => {
    axios.post('http://16.171.229.175:3001/api/adminLogin', values)
      .then(response => {
        console.log(response.data.message);
        const decoded = jwtDecode(response.data.token); // Use jwtDecode instead of jwt_decode
       
        localStorage.setItem('email', decoded.email);
        localStorage.setItem('role', decoded.role);
        window.location.href = '/DashBoard';
      })
      .catch(err => {
        console.error(err);
        if (err.response) {
          setErrors({ general: err.response.data.message });
        } else {
          setErrors({ general: 'Something went wrong. Please try again.' });
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1 mt-5" >
      <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div>
          <img src="/logo.webp" className="w-32 mx-auto" alt="Logo" />
        </div>
        <div className="mt-12 flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold text-center" style={{ color: '#2d4362' }}>
            LOGIN
          </h1>
          <div className="w-full flex-1 mt-8">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting, errors }) => (
                <Form className="mx-auto max-w-xs">
                  <div>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email"
                      className="w-full px-8 p-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-md mt-1" />
                  </div>
                  <div className="mt-4">
                    <Field
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="w-full px-8 p-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-md mt-1" />
                  </div>
                  {errors.general && <div className="text-red-500 text-md mt-3">{errors.general}</div>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <i className="fas fa-sign-in-alt w-6 h-6 -ml-2"></i>
                    <span className="ml-3" style={{ color: '#fff' }}>SIGN IN</span>
                  </button>
                </Form>
              )}
            </Formik>
            
          </div>
        </div>
      </div>
      <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
        <div
          className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: "url('./login-img.avif')" }}
        ></div>
      </div>
    </div>
  );
};

export default AdminLogin;
