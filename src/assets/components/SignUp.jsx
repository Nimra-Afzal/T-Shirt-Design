import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_API } from '../../Api';
import { signupSchema } from '../../validationSchemas';
import Logo from './Logo';

const SignUp = () => {
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      await AUTH_API.post('/signup', values);
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setSignupError(
        err.response?.data?.error || 
        'Error signing up. Please try again.'
      );
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
      <div className="p-8 px-24 mt-20 rounded-lg shadow-lg w-[850px] bg-white/20 backdrop-blur-sm">
        <h2 className="text-4xl font-bold mb-8">Sign Up</h2>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
                <ErrorMessage name="username" component="div" className="text-red-500 mt-2 text-sm" />
              </div>
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 mt-2 text-sm" />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 mt-2 text-sm" />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-4 btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>
        {signupError && (
          <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-xl text-center">
            {signupError}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="block text-black hover:text-gray-700 transition-colors"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

