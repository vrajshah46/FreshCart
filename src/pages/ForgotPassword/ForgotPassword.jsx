import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleForgotPassword(data) {
    setIsLoading(true);
    
    try {
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryTime = Date.now() + 600000; // 10 minutes from now
      
      // Store the email and code in localStorage
      localStorage.setItem('resetEmail', data.email);
      localStorage.setItem('resetCode', code);
      localStorage.setItem('codeExpiry', expiryTime.toString());
      
      // For demo purposes, show the code in an alert
      // alert(`Your verification code is: ${code}\n\nThis is a demo. In a real app, this would be sent via email.`);
      
      setErr(null);
      toast.success('Proceeding to verification');
      navigate('verifyCode');
    } catch (error) {
      console.error('Error in password reset:', error);
      setErr('An error occurred. Please try again.');
      toast.error('Failed to process request');
    } finally {
      setIsLoading(false);
    }
  }

  const validate = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .email('Email is not valid'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: handleForgotPassword,
    validationSchema: validate,
  });

  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>

      <form
        method="post"
        className="max-w-md mx-auto"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl text-gray-500 mb-5 font-bold">
          Enter Your Email:
        </h1>
        {err && <div className="bg-red-300 py-1 mb-4 font-light">{err}</div>}

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="email"
            id="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
          {formik.errors.email && formik.touched.email && (
            <span className="text-red-600 font-light text-sm">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            Back
          </button>
          {isLoading ? (
            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              disabled
            >
              <i className="fa-solid fa-spinner animate-spin"></i>
            </button>
          ) : (
            <button
              type="submit"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Send Code
            </button>
          )}
        </div>
      </form>
    </>
  );
}