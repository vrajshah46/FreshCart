import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';

export default function VerifyCode() {
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleResetCode(data) {
    setIsLoading(true);
    
    try {
      // Accept any 6-digit code
      if (data.resetCode.length !== 6 || !/^\d+$/.test(data.resetCode)) {
        throw new Error('Please enter a valid 6-digit code');
      }
      
      // Store dummy verification in localStorage
      localStorage.setItem('isCodeVerified', 'true');
      
      // Proceed to reset password
      setErr(null);
      toast.success('Code verified successfully');
      navigate('resetPassword');
    } catch (error) {
      console.error('Verification error:', error);
      setErr(error.message || 'Verification failed. Please try again.');
      toast.error(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  }

  const validate = Yup.object({
    resetCode: Yup.string()
      .required('Verification code is required')
      .matches(/^\d{6}$/, 'Code must be 6 digits'),
  });

  const formik = useFormik({
    initialValues: {
      resetCode: '',
    },
    onSubmit: handleResetCode,
    validationSchema: validate,
  });

  return (
    <>
      <Helmet>
        <title>Verify Code</title>
      </Helmet>

      <form
        method="post"
        className="max-w-md mx-auto"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl text-gray-500 mb-5 font-bold">
          Enter Verification Code:
        </h1>
        {err && <div className="bg-red-300 py-1 mb-4 font-light">{err}</div>}

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="resetCode"
            id="resetCode"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.resetCode}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
            placeholder=" "
            maxLength="6"
          />
          <label
            htmlFor="resetCode"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Enter any 6-digit code
          </label>
          {formik.errors.resetCode && formik.touched.resetCode && (
            <span className="text-red-600 font-light text-sm">
              {formik.errors.resetCode}
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
              Verify
            </button>
          )}
        </div>
      </form>
    </>
  );
}