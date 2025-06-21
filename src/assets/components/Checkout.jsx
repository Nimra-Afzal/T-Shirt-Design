import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API, { AUTH_API } from '../../Api';
import OrderConfirmation from './OrderConfirmation';
import Experience from './Experience';
import { useNavigate } from 'react-router-dom';

const checkoutSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  phone: Yup.string().required('Phone number is required'),
  deliveryMethod: Yup.string().required('Delivery method is required'),
  address: Yup.string().when('deliveryMethod', {
    is: 'delivery',
    then: () => Yup.string().required('Address is required for delivery'),
    otherwise: () => Yup.string()
  })
});

const Checkout = ({ onClose, sizeData, designImage }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const totalItems = Object.values(sizeData).reduce((sum, num) => sum + Number(num), 0);
  const totalPrice = totalItems * 25;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const { data } = await AUTH_API.get('/profile');
        if (data) {
          setUserInfo({
            email: data.email,
            ...data.deliveryInfo
          });
          // Only clear error if we successfully got user data
          setError('');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load user information. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    try {
      if (!userInfo || !userInfo.email) {
        throw new Error('User information is missing');
      }

      const orderData = {
        ...values,
        email: userInfo.email,
        sizeData,
        totalPrice,
        designImage
      };

      const { data } = await API.post('/orders', orderData);
      
      if (data.orderNumber) {
        setOrderNumber(data.orderNumber);
        setShowConfirmation(true);
      } else {
        throw new Error('No order number received');
      }
    } catch (err) {
      console.error('Order error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!userInfo && !loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p>Unable to load user information. Please try again later.</p>
          <button
            onClick={onClose}
            className="mt-4 w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <OrderConfirmation
        orderNumber={orderNumber}
        onBackToHome={() => {
          onClose();
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Order Summary */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="space-y-6">
                {/* Size Breakdown */}
                <div>
                  <h4 className="font-semibold mb-3">Size Breakdown</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(sizeData).map(([size, quantity]) => 
                      quantity > 0 && (
                        <div key={size} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="capitalize font-medium">{size}</span>
                            <span className="text-gray-600">x{quantity}</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            ${(quantity * 25).toFixed(2)}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">Estimated Delivery: 5-7 business days</p>
                    <p className="text-gray-600">Payment Method: Cash on Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Delivery Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Delivery Details</h3>
            
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{userInfo?.email}</p>
            </div>

            <Formik
              initialValues={{
                fullName: userInfo?.fullName || '',
                phone: userInfo?.phone || '',
                deliveryMethod: userInfo?.defaultDeliveryMethod || 'delivery',
                address: userInfo?.address || ''
              }}
              validationSchema={checkoutSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, values }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Field
                      name="fullName"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <ErrorMessage name="fullName" component="div" className="text-red-500 mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Field
                      name="phone"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500 mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Method
                    </label>
                    <Field
                      as="select"
                      name="deliveryMethod"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="delivery">Home Delivery</option>
                      <option value="pickup">Pick Up</option>
                    </Field>
                  </div>

                  {values.deliveryMethod === 'delivery' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Address
                      </label>
                      <Field
                        name="address"
                        as="textarea"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="3"
                      />
                      <ErrorMessage name="address" component="div" className="text-red-500 mt-1" />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full p-3 bg-[#00A8A8] text-white rounded-lg hover:bg-[#009494] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 