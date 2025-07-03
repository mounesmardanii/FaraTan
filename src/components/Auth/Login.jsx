import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { assets } from "../../assets/assets";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePassword = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
      remember: false,
    },
    validationSchema: Yup.object({
      phone: Yup.string().required("شماره تلفن الزامی است"),
      password: Yup.string().required("رمز عبور الزامی است"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);

        const isMaryamAdmin =
          values.phone === "09116868921" &&
          values.password === "mounes0713";

        if (isMaryamAdmin) {
          login({
            name: "مریم",
            email: "maryam@example.com",
            phone: values.phone,
            role: "admin",
          });
        } else {
          login({
            name: `کاربر ${values.phone.slice(-4)}`,
            email: `${values.phone}@example.com`,
            phone: values.phone,
            role: "user",
          });
        }

        navigate("/");
      } catch (error) {
        setErrors({ submit: "خطایی در ورود رخ داد. لطفاً دوباره تلاش کنید." });
      } finally {
        setSubmitting(false);
      }
    },

  });

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#9FC6C3] font-sans px-4 overflow-hidden">
      <img
        src={assets.bag}
        alt="پس‌زمینه موج"
        className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none"
      />

      <motion.img
        src={assets.back}
        alt="بازگشت"
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.15 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="absolute top-4 right-4 w-8 h-8 cursor-pointer z-50"
        style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))" }}
      />

      <div className="flex flex-col md:flex-row w-full max-w-6xl z-10">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2 flex items-center justify-center p-4 md:p-10 bg-transparent"
        >
          <img
            src={assets.loginpic}
            alt="login illustration"
            className="w-full max-w-[300px] md:max-w-[400px]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2 bg-[#055B5C] text-white px-4 md:px-10 py-6 md:py-12 relative rounded-3xl shadow-2xl mx-0 md:mx-4 md:mt-13 flex flex-col justify-center"
        >
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-extrabold text-[#FF6600] mb-2 cursor-context-menu">
              باشگاه فراتن
            </h2>
            <p className="text-sm md:text-lg text-white cursor-context-menu">
              با ورود به حساب، سفر سلامتیت رو ادامه بده
            </p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col space-y-4 md:space-y-6 text-xs md:text-base"
          >
            <div>
              <input
                type="text"
                name="phone"
                placeholder="شماره تلفن خود را وارد کنید"
                className="w-full py-2 px-3 rounded bg-[#d9d9d9] border border-gray-300 text-black text-right"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-300 text-xs md:text-sm mt-1">
                  {formik.errors.phone}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full py-2 px-3 rounded bg-[#d9d9d9] border border-gray-300 text-black text-right pr-10"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <motion.span
                  onClick={togglePassword}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-[#055B5C]"
                  whileTap={{ rotate: 180 }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </motion.span>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-300 text-xs md:text-sm">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <label className="flex flex-row-reverse items-center gap-2 text-white text-xs md:text-sm cursor-pointer mt-1">
              <input
                type="checkbox"
                name="remember"
                className="accent-[#FF6600] w-3 md:w-4 h-3 md:h-4"
                onChange={formik.handleChange}
                checked={formik.values.remember}
              />
              من را به خاطر بسپار
            </label>

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
              transition={{ type: "spring", stiffness: 200 }}
              className={`bg-[#FF6600] hover:brightness-90 transition-all py-2 px-3 rounded-xl text-white font-bold text-sm md:text-lg mt-4 ${formik.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              ورود
            </motion.button>
          </form>

          <div className="flex flex-col gap-2 text-xs md:text-sm text-white mt-4 text-right">
            <Link
              to="/forgot-password"
              className="hover:text-[#FF6600] cursor-pointer transition-colors"
            >
              رمز عبور خود را فراموش کرده‌اید؟
            </Link>
            <Link
              to="/signup"
              className="hover:text-[#FF6600] cursor-pointer transition-colors "
            >
              آیا هنوز ثبت‌نام نکرده‌اید؟ <span className="ml-1">ثبت‌نام</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;