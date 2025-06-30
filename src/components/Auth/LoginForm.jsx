import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

function LoginForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      gender: '',
      birthDate: null,
      height: '',
      medicalCondition: '',
      sportGoal: '',
      photo: null,
    },
    validationSchema: Yup.object({
      gender: Yup.string().required('جنسیت الزامی است'),
      birthDate: Yup.date().required('تاریخ تولد الزامی است'),
      height: Yup.number()
        .required('قد الزامی است')
        .positive('قد باید عدد مثبت باشد'),
      medicalCondition: Yup.string(),
      sportGoal: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log('اطلاعات فرم:', values);
      alert('اطلاعات با موفقیت ثبت شد!');
    },
  });

  const handlePhotoChange = (e) => {
    const file = e.currentTarget.files[0];
    formik.setFieldValue('photo', file);
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-[#9FC6C3] font-sans px-4"
      dir="rtl"
    >
      <motion.img
        src={assets.back}
        alt="بازگشت"
        onClick={() => navigate('/verify')}
        whileHover={{ scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="fixed top-4 right-4 w-8 h-8 cursor-pointer z-50"
        style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }}
      />

      <div className="flex flex-col md:flex-row w-full max-w-6xl mt-16 md:mt-0">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="md:w-1/2 bg-[#055B5C] text-white px-6 md:px-10 py-6 md:py-8 relative rounded-3xl shadow-2xl mx-0 md:mx-4 flex flex-col justify-center"
        >
          <div className="text-center mb-4 md:mb-6" style={{ direction: 'rtl' }}>
            <h2 className="text-lg md:text-2xl font-extrabold text-[#FF6600] mb-1 cursor-context-menu">
              خوش آمدی به جمع ما.
            </h2>
            <p className="text-xs md:text-base cursor-context-menu">
              پیش از ادامه <br />
              اطلاعات خود را وارد کنید
            </p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col space-y-4 text-xs md:text-sm"
            dir="rtl"
          >
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="gender"
                className="w-1/3 text-right text-white font-semibold cursor-pointer"
              >
                جنسیت
              </label>
              <select
                id="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-2/3 rounded p-2 text-black text-right bg-gray-200"
              >
                <option value="">انتخاب کنید</option>
                <option value="male">مرد</option>
                <option value="female">زن</option>
              </select>
            </div>
            {formik.touched.gender && formik.errors.gender && (
              <div className="text-red-300 text-xs mt-1 text-right">{formik.errors.gender}</div>
            )}

            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="birthDate"
                className="w-1/3 text-right text-white font-semibold cursor-pointer"
              >
                تاریخ تولد
              </label>
              <div className="w-2/3">
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={formik.values.birthDate}
                  onChange={(date) => formik.setFieldValue('birthDate', date)}
                  inputClass="w-full rounded p-2 text-black text-right bg-gray-200"
                  format="YYYY/MM/DD"
                  placeholder="تاریخ تولد خود را انتخاب کنید"
                  calendarPosition="bottom-right"
                  id="birthDate"
                />
              </div>
            </div>
            {formik.touched.birthDate && formik.errors.birthDate && (
              <div className="text-red-300 text-xs mt-1 text-right">{formik.errors.birthDate}</div>
            )}

            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="height"
                className="w-1/3 text-right text-white font-semibold cursor-pointer"
              >
                قد
              </label>
              <input
                id="height"
                type="number"
                name="height"
                placeholder="سانتی‌متر"
                value={formik.values.height}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-2/3 rounded p-2 text-black text-right bg-gray-200"
              />
            </div>
            {formik.touched.height && formik.errors.height && (
              <div className="text-red-300 text-xs mt-1 text-right">{formik.errors.height}</div>
            )}

            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="medicalCondition"
                className="w-1/3 text-right text-white font-semibold cursor-pointer"
              >
                شرایط پزشکی:
              </label>
              <input
                id="medicalCondition"
                type="text"
                name="medicalCondition"
                placeholder="در صورت وجود، وارد کنید"
                value={formik.values.medicalCondition}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-2/3 rounded p-2 text-black text-right bg-gray-200"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="sportGoal"
                className="w-1/3 text-right text-white font-semibold cursor-pointer"
              >
                هدف شما از ورزش چیست؟
              </label>
              <input
                id="sportGoal"
                type="text"
                name="sportGoal"
                placeholder="مثلا افزایش استقامت، کاهش وزن و ..."
                value={formik.values.sportGoal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-2/3 rounded p-2 text-black text-right bg-gray-200"
              />
            </div>

            <div className="flex items-center gap-4 justify-between">
              <label
                htmlFor="photoInput"
                className="text-white font-semibold cursor-pointer"
                style={{ minWidth: '150px' }}
              >
                عکس خود را انتخاب کنید
              </label>

              <div className="flex items-center gap-4 flex-grow">
                <label htmlFor="photoInput" className="cursor-pointer">
                  <img
                    src={assets.upload}
                    alt="upload icon"
                    className="w-8 h-8 object-contain"
                  />
                </label>
                <span className="text-white text-sm truncate max-w-[160px]">
                  {formik.values.photo ? formik.values.photo.name : 'فایلی انتخاب نشده'}
                </span>
              </div>

              <input
                id="photoInput"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-[#FF6600] hover:brightness-90 transition-all py-2 rounded-xl text-white font-bold text-lg cursor-pointer"
            >
              ادامه
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="md:w-1/2 flex items-center justify-center p-4 md:p-10 bg-[#9FC6C3]"
        >
          <img
            src={assets.welcompic}
            alt="welcome illustration"
            className="w-full max-w-[300px] md:max-w-[600px]"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default LoginForm;
