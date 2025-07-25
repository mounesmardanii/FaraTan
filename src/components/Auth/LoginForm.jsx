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
      birthDate: Yup.mixed().required('تاریخ تولد الزامی است'),
      height: Yup.number().required('قد الزامی است').positive('قد باید عدد مثبت باشد'),
      medicalCondition: Yup.string(),
      sportGoal: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const basicData = JSON.parse(localStorage.getItem('signupBasic'));
        if (!basicData) {
          alert('اطلاعات اولیه یافت نشد. لطفاً از اول ثبت‌نام کنید.');
          navigate('/signup');
          return;
        }

        // اگر عکس وجود دارد، تبدیل به base64 شود
        const getBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          });
        };

        const photoBase64 = values.photo ? await getBase64(values.photo) : null;

        const combinedData = {
          ...basicData,
          gender: values.gender,
          birthDate: values.birthDate?.format?.() || values.birthDate,
          height: values.height,
          medicalCondition: values.medicalCondition,
          sportGoal: values.sportGoal,
          photo: photoBase64,
        };

        // ذخیره داده نهایی
        localStorage.setItem('signupFinal', JSON.stringify(combinedData));

        console.log('✅ داده نهایی ثبت‌نام:', combinedData);

        navigate('/register-info'); // یا هر صفحه بعدی
      } catch (err) {
        console.error('خطا در پردازش فرم:', err);
      }
    },
  });

  const handlePhotoChange = (e) => {
    const file = e.currentTarget.files[0];
    formik.setFieldValue('photo', file);
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-[#9FC6C3] font-sans px-4 overflow-hidden"
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
        onClick={() => navigate('/verify')}
        whileHover={{ scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="fixed top-4 right-4 w-8 h-8 cursor-pointer z-50"
        style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }}
      />

      <div className="flex flex-col md:flex-row w-full max-w-6xl mt-16 md:mt-0 z-10">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="md:w-1/2 bg-[#055B5C] text-white px-6 md:px-10 py-6 md:py-8 relative rounded-3xl shadow-2xl mx-0 md:mx-4 flex flex-col justify-center"
        >
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-extrabold text-[#FF6600] mb-1">خوش آمدی به جمع ما.</h2>
            <p className="text-xs md:text-base">پیش از ادامه اطلاعات خود را وارد کن</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-4 text-xs md:text-sm">
            {/* جنسیت */}
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="gender" className="w-1/3 text-right text-white font-semibold">جنسیت</label>
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
              <div className="text-red-300 text-xs text-right">{formik.errors.gender}</div>
            )}

            {/* تاریخ تولد */}
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="birthDate" className="w-1/3 text-right text-white font-semibold">تاریخ تولد</label>
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
              <div className="text-red-300 text-xs text-right">{formik.errors.birthDate}</div>
            )}

            {/* قد */}
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="height" className="w-1/3 text-right text-white font-semibold">قد (متر)</label>
              <input
                id="height"
                type="number"
                name="height"
                placeholder="به متر وارد کنید"
                value={formik.values.height}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                step="0.01"  // فقط مقادیر اعشاری (متر) پذیرفته می‌شود
                min="0"  // جلوگیری از وارد کردن اعداد منفی
                className="w-2/3 rounded p-2 text-black text-right bg-gray-200"
              />
            </div>
            {formik.touched.height && formik.errors.height && (
              <div className="text-red-300 text-xs text-right">{formik.errors.height}</div>
            )}


            {/* شرایط پزشکی */}
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="medicalCondition" className="w-1/3 text-right text-white font-semibold">شرایط پزشکی:</label>
              <input
                id="medicalCondition"
                type="text"
                name="medicalCondition"
                placeholder="در صورت وجود، وارد کنید"
                value={formik.values.medicalCondition}
                onChange={formik.handleChange}
                className="w-2/3 rounded p-2 text-black text-right bg-gray-200"
              />
            </div>

            {/* هدف ورزش */}
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="sportGoal" className="w-1/3 text-right text-white font-semibold">هدف شما از ورزش چیست؟</label>
              <input
                id="sportGoal"
                type="text"
                name="sportGoal"
                placeholder="مثلا کاهش وزن یا عضله‌سازی"
                value={formik.values.sportGoal}
                onChange={formik.handleChange}
                className="w-2/3 rounded p-2 text-black text-right bg-gray-200"
              />
            </div>

            {/* عکس */}
            <div className="flex items-center gap-4 justify-between">
              <label htmlFor="photoInput" className="text-white font-semibold" style={{ minWidth: '150px' }}>عکس خود را انتخاب کنید</label>
              <div className="flex items-center gap-4 flex-grow">
                <label htmlFor="photoInput" className="cursor-pointer">
                  <img src={assets.upload} alt="upload icon" className="w-8 h-8 object-contain" />
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
          className="md:w-1/2 flex items-center justify-center p-4 md:p-10"
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
