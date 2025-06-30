import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function VerifyCode() {
  const [codeDigits, setCodeDigits] = useState(['', '', '', '']);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required('کد تایید الزامی است')
        .length(4, 'کد باید ۴ رقم باشد'),
    }),
    onSubmit: () => {
      if (formik.values.code.length === 4) {
        console.log('کد تایید:', formik.values.code);
        navigate('/loginform');  
      } else {
        alert('لطفا تمام ۴ رقم کد را وارد کنید.');
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue('code', codeDigits.join(''));
  }, [codeDigits]);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCodeDigits = [...codeDigits];
      newCodeDigits[index] = value;
      setCodeDigits(newCodeDigits);
      if (value && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const resendCode = () => {
    alert('کد تایید مجدداً ارسال شد.');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#9FC6C3] font-sans px-4">

      <motion.img
        src={assets.back}
        alt="بازگشت"
        onClick={() => navigate('/signup')}
        whileHover={{ scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="absolute top-4 right-4 w-8 h-8 cursor-pointer z-50"
        style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }}
      />

      <div className="flex flex-col md:flex-row-reverse w-full max-w-6xl">

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="md:w-1/2 flex items-center justify-center p-4 md:p-10 bg-[#9FC6C3]"
        >
          <img
            src={assets.Verifypic}
            alt="verify illustration"
            className="w-full max-w-[250px] md:max-w-[600px]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="md:w-1/2 bg-[#055B5C] text-white px-6 md:px-14 py-6 md:py-12 relative rounded-3xl shadow-2xl mx-0 md:mx-4 flex flex-col justify-center"
          style={{ position: 'relative' }}
        >
          <img
            src={assets.freepik}
            alt="freepik"
            className="hidden md:block absolute top-6 right-6 w-16 h-auto rounded-lg"
          />

          <div className="text-center mb-6 md:mb-8 px-2">
            <h2 className="text-lg md:text-3xl font-extrabold text-[#FF6600] mb-3 cursor-context-menu leading-tight">
              با فراتن، قدرتت رو کشف کن
              <br />و به هدف‌هات برس
            </h2>
            <p className="text-sm md:text-lg font-bold text-white cursor-context-menu">
              کد تایید را وارد کنید
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-6 md:space-y-8">

            <div className="flex justify-center gap-3 md:gap-6">
              {codeDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => (inputsRef.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  className="w-12 h-12 md:w-20 md:h-20 rounded-xl bg-gray-300 text-center text-xl md:text-3xl font-bold text-[#055B5C] focus:outline-none"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>

            {formik.touched.code && formik.errors.code && (
              <div className="text-red-300 text-center text-sm">{formik.errors.code}</div>
            )}

            <div
              className="text-center text-white underline cursor-pointer mb-4"
              onClick={resendCode}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') resendCode(); }}
            >
              دوباره ارسال شود
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-[#FF6600] hover:brightness-90 transition-all py-3 rounded-xl text-white font-bold text-lg cursor-pointer"
            >
              تایید
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default VerifyCode;
