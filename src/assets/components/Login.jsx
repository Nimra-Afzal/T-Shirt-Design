import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_API } from '../../Api';
import { loginSchema } from '../../validationSchemas';
import Logo from './Logo';

const Login = ({ setAuthStatus }) => {
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const { data } = await AUTH_API.post('/login', values);
      console.log('Login response:', data);

      setAuthStatus(data.token, data.user.isAdmin);
      
      if (data.user.isAdmin) {
        console.log('User is admin, redirecting to admin dashboard');
        navigate('/admin');
      } else {
        console.log('User is not admin, redirecting to profile');
        navigate('/profile');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundImage: 'url("./Pattern-07.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Logo */}
      <div className="mx-auto mt-16 top-8 left-8">
        <Logo />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="p-8 px-24 rounded-lg shadow-lg w-[800px] bg-white/20 backdrop-blur-sm">
          <h2 className="text-4xl text-center font-bold mb-8">Login</h2>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
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
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>
          {loginError && (
            <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-xl text-center">
              {loginError}
            </div>
          )}
          <div className="mt-6 space-y-3 text-center">
            <Link 
              to="/signup" 
              className="block text-black hover:text-gray-700 transition-colors"
            >
              Don't have an account? Sign up
            </Link>
            <Link 
              to="/forgot-password" 
              className="block text-black hover:text-gray-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

