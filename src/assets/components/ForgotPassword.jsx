import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { AUTH_API } from '../../Api';
import Logo from './Logo';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await AUTH_API.post('/forgot-password', values);
      setStatus({
        type: 'success',
        message: 'Password reset link has been sent to your email.'
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setStatus({
          type: 'error',
          message: 'No account exists with this email address.'
        });
      } else {
        setStatus({
          type: 'error',
          message: err.response?.data?.error || 'Something went wrong. Please try again.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      backgroundImage: 'url("./Pattern-07.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <div className="p-8 px-24 mt-20 rounded-lg shadow-lg w-[800px] bg-white/20 backdrop-blur-sm">
        <h2 className="text-4xl text-center font-bold mb-8">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 mt-2 text-sm" />
              </div>
              
              {status.message && (
                <div className={`p-4 rounded-xl text-center ${
                  status.type === 'success' 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-red-50 text-red-500'
                }`}>
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-4 btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="block text-black hover:text-gray-700 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 