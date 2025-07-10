import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const formVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <Formik
            initialValues={{ phoneNumber: '' }}
            validationSchema={Yup.object({
                phoneNumber: Yup.string()
                    .matches(/^09[0-9]{9}$/, 'شماره تماس باید با 09 شروع شده و 11 رقم باشد')
                    .required('شماره تماس الزامی است'),
            })}
            onSubmit={(values) => {
                console.log('درخواست بازیابی رمز:', values);
                alert('اگر شماره تماس معتبر باشد، لینک بازیابی ارسال خواهد شد.');
                navigate('/login');
            }}
        >
            {(formik) => (
                <div
                    dir="rtl"
                    className="min-h-screen bg-[#9FC6C3] flex items-center justify-center px-6 py-12 font-sans relative overflow-hidden"
                >
                    <img
                        src={assets.bag}
                        alt="پس‌زمینه موج"
                        className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none"
                    />
                    <motion.img
                        src={assets.back}
                        alt="بازگشت"
                        onClick={() => navigate('/login')}
                        whileHover={{ scale: 1.15 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="absolute top-4 right-4 w-8 h-8 cursor-pointer z-50"
                        style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }}
                    />

                    <div className="w-full max-w-6xl z-10 md:flex items-center gap-10">
                        <motion.div
                            initial={{ opacity: 0, x: -80 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="flex justify-center mb-6 md:mb-0 w-full md:w-1/2"
                        >
                            <img
                                src={assets.forgetpic}
                                alt="illustration"
                                className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] drop-shadow-xl"
                            />
                        </motion.div>

                        <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            className="md:w-1/2 bg-[#055B5C] rounded-[2rem] p-6 md:p-10 text-white flex flex-col justify-center shadow-2xl"
                        >
                            <motion.h2
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-xl md:text-2xl font-bold text-[#FF6600] mb-4 text-center md:text-right leading-snug"
                            >
                                فراموشی رمز عبور؟ مشکلی نیست!
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-sm md:text-base text-center md:text-right mb-6 leading-relaxed"
                            >
                                لطفاً شماره تماس خود را وارد کنید تا لینک بازیابی برای شما ارسال شود.
                            </motion.p>

                            <motion.form
                                onSubmit={formik.handleSubmit}
                                className="space-y-3 md:space-y-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="شماره تماس خود را وارد کنید (مثال: 09123456789)"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full p-3 rounded-xl bg-gray-100 text-black text-right"
                                />
                                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                    <div className="text-red-300 text-xs text-right">{formik.errors.phoneNumber}</div>
                                )}

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                    className="w-full py-3 bg-[#FF6600] text-white font-bold text-lg rounded-xl cursor-pointer"
                                >
                                    ارسال لینک بازیابی
                                </motion.button>
                            </motion.form>

                            <motion.p
                                onClick={() => navigate('/new-password')}
                                className="mt-6 text-center text-sm cursor-pointer transition-colors text-white hover:text-[#FF6600]"
                            >
                                رمز عبور جدید؟ ورود
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default ForgotPassword;