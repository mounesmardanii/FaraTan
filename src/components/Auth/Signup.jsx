import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { assets } from '../../assets/assets';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      nationalCode: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('نام الزامی است'),
      phone: Yup.string().required('شماره تلفن الزامی است'),
      nationalCode: Yup.string().required('کد ملی الزامی است'),
      password: Yup.string().required('رمز عبور الزامی است'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // اینجا می‌تونید درخواست API خودتون رو برای ثبت‌نام بفرستید
        // مثلا:
        // await api.signup(values);

        console.log('ورودی‌های ثبت‌نام:', values);
        
        // بعد از ثبت موفقیت‌آمیز کاربر رو به صفحه بعد هدایت کنید:
        navigate('/verify');
      } catch (error) {
        // اگر خطایی از سرور اومد، اینجا هندلش کنید
        setErrors({ submit: 'خطایی در ثبت‌نام رخ داد. دوباره تلاش کنید.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#9FC6C3] font-sans px-4">

      {/* دکمه بازگشت */}
      <motion.img
        src={assets.back}
        alt="بازگشت"
        onClick={() => navigate('/login')}
        whileHover={{ scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="absolute top-4 right-4 w-8 h-8 cursor-pointer z-50"
        style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }}
      />

      <div className="flex flex-col md:flex-row w-full max-w-6xl">

        {/* تصویر سمت چپ */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="md:w-1/2 flex items-center justify-center p-4 md:p-10 bg-[#9FC6C3]"
        >
          <img
            src={assets.signuppic}
            alt="signup illustration"
            className="w-full max-w-[300px] md:max-w-[600px]"
          />
        </motion.div>

        {/* فرم سمت راست */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="md:w-1/2 bg-[#055B5C] text-white px-4 md:px-10 py-6 md:py-12 relative rounded-3xl shadow-2xl mx-0 md:mx-4 flex flex-col justify-center"
        >

          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-extrabold text-[#FF6600] mb-2 cursor-context-menu">
              باشگاه فراتن
            </h2>
            <p className="text-sm md:text-lg text-white cursor-context-menu">
              ثبت‌نام شما گامی به سوی بهترین نسخه خودتان است. به فراتن خوش آمدید
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-6 md:space-y-8 text-xs md:text-base">

            <div>
              <input
                type="text"
                name="name"
                placeholder="نام خود را وارد کنید"
                className="w-full p-2 rounded bg-[#d9d9d9] border border-gray-300 text-black text-right text-xs md:text-base"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-300 text-xs md:text-sm mt-1">{formik.errors.name}</div>
              )}
            </div>

            <div>
              <input
                type="text"
                name="phone"
                placeholder="شماره تلفن خود را وارد کنید"
                className="w-full p-2 rounded bg-[#d9d9d9] border border-gray-300 text-black text-right text-xs md:text-base"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-300 text-xs md:text-sm mt-1">{formik.errors.phone}</div>
              )}
            </div>

            <div>
              <input
                type="text"
                name="nationalCode"
                placeholder="کد ملی خود را وارد کنید"
                className="w-full p-2 rounded bg-[#d9d9d9] border border-gray-300 text-black text-right text-xs md:text-base"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nationalCode}
              />
              {formik.touched.nationalCode && formik.errors.nationalCode && (
                <div className="text-red-300 text-xs md:text-sm mt-1">{formik.errors.nationalCode}</div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full p-2 rounded bg-[#d9d9d9] border border-gray-300 text-black text-right pr-10 md:pr-12 text-xs md:text-base hide-password-toggle"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <motion.span
                  onClick={togglePassword}
                  className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg md:text-xl text-[#055B5C]"
                  whileTap={{ rotate: 180 }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </motion.span>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-300 text-xs md:text-sm">{formik.errors.password}</div>
              )}
            </div>

            {/* خطای ارسال */}
            {formik.errors.submit && (
              <div className="text-red-500 text-center text-sm">
                {formik.errors.submit}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={formik.isSubmitting}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={`bg-[#FF6600] hover:brightness-90 transition-all p-2 rounded-xl text-white font-bold text-sm md:text-lg mt-2 cursor-pointer ${
                formik.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              ثبت نام
            </motion.button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
