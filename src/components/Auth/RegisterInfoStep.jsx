import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

function RegisterInfoStep() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      waist: '',
      hips: '',
      chest: '',
      arm: '',
      thigh: '',
      weight: '',
    },
    validationSchema: Yup.object({
      waist: Yup.number().required('دور کمر الزامی است'),
      hips: Yup.number().required('دور باسن الزامی است'),
      chest: Yup.number().required('دور سینه الزامی است'),
      arm: Yup.number().required('دور بازو الزامی است'),
      thigh: Yup.number().required('دور ران الزامی است'),
      weight: Yup.number().required('وزن الزامی است'),
    }),
    onSubmit: async (values) => {
      try {
        console.log('ثبت موفق:', values);
        navigate('/');
      } catch (error) {
        console.error('خطا در ثبت اطلاعات:', error);
        alert('خطا در ثبت اطلاعات');
      }
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#9FC6C3] px-4 py-10 relative overflow-hidden"
      dir="rtl"
    >
      <img
        src={assets.bag}
        alt="پس‌زمینه موج"
        className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none"
      />

      <motion.img
        src={assets.back}
        alt="بازگشت"
        onClick={() => navigate('/loginform')}
        whileHover={{ scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="fixed top-4 right-4 w-8 h-8 cursor-pointer z-50"
        style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-[#055B5C] text-white rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10 w-full max-w-[95%] md:max-w-4xl shadow-2xl z-10"
      >
        <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-[#FF6600] mb-6 leading-relaxed">
          برای اینکه بهتر پیشرفتت رو ببینیم و دقیق‌تر همراهی‌ات کنیم،
          <br className="hidden sm:block" /> لطفاً اندازه‌های بدنت رو وارد کن.
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-black">
            {[ 
              { name: 'waist', placeholder: 'دور کمر' },
              { name: 'hips', placeholder: 'دور باسن' },
              { name: 'chest', placeholder: 'دور سینه' },
              { name: 'arm', placeholder: 'دور بازو' },
              { name: 'thigh', placeholder: 'دور ران' },
              { name: 'weight', placeholder: 'وزن' },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <input
                  type="number"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded-xl p-3 bg-gray-100 text-right"
                />
                {formik.touched[field.name] && formik.errors[field.name] && (
                  <span className="text-red-300 text-xs mt-1 text-right">
                    {formik.errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm sm:text-base mt-2 text-orange-400 text-center leading-relaxed">
            با ثبت این داده‌ها، می‌تونی پیشرفت خودت رو بهتر دنبال کنی 💪
          </p>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-full mt-4 py-3 bg-[#FF6600] text-white font-bold text-lg rounded-2xl"
          >
            ثبت
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default RegisterInfoStep;
