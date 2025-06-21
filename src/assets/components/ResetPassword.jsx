import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { AUTH_API } from '../../Api';
import Logo from './Logo';

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPassword = () => {
  const [status, setStatus] = useState({ type: '', message: '' });
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await AUTH_API.post(`/reset-password/${token}`, {
        password: values.password
      });
      setStatus({
        type: 'success',
        message: 'Password successfully reset'
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.error || 'Something went wrong'
      });
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
        <h2 className="text-4xl font-bold mb-8">Reset Password</h2>
        <p className="text-gray-600 mb-8">
          Please enter your new password below.
        </p>
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="New Password"
                  className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 mt-2 text-sm" />
              </div>

              <div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 mt-2 text-sm" />
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
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword; 