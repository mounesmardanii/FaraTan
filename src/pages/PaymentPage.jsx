import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePurchases } from "../context/PurchaseContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { assets } from "../assets/assets"; // ← بک‌گراند و آیکن‌ها

const PaymentSchema = Yup.object().shape({
  cardNumber: Yup.string()
    .matches(/^\d{16}$/, "شماره کارت باید ۱۶ رقم باشد")
    .required("شماره کارت الزامی است"),
  cvv2: Yup.string()
    .matches(/^\d{3,4}$/, "CVV2 باید ۳ یا ۴ رقم باشد")
    .required("CVV2 الزامی است"),
  expiry: Yup.string()
    .matches(/^\d{2}\/\d{2}$/, "فرمت صحیح: MM/YY")
    .required("تاریخ انقضا الزامی است"),
  otp: Yup.string()
    .matches(/^\d{6}$/, "رمز پویا باید ۶ رقم باشد")
    .required("رمز پویا الزامی است"),
});

const PaymentPage = () => {
  const { state } = useLocation();
  const { addPurchase } = usePurchases();
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);

  if (!state) {
    return (
      <div className="text-center mt-20 text-red-600 font-bold">
        هیچ دوره‌ای برای پرداخت انتخاب نشده است.
      </div>
    );
  }

  const handleSendOTP = () => {
    setOtpSent(true);
    alert("رمز پویا برای شما ارسال شد! (شبیه‌سازی شده)");
  };

  const handleSubmit = (values) => {
    addPurchase(state);
    navigate("/my-purchases");
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4 py-10 bg-cover bg-[#9FC6C3] bg-center"
      style={{ backgroundImage: `url(${assets.bag})` }}
    >
      {/* دکمه برگشت */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 right-10 p-2 transition cursor-pointer"
        title="بازگشت"
      >
        <img src={assets.back} alt="بازگشت" className="w-8 h-8" />
      </button>

      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full border-[1.5px] border-[#256250] bg-opacity-95 text-right">
        <h2 className="text-2xl font-extrabold text-[#FF6600] mb-6 text-center">
          درگاه پرداخت فراتن
        </h2>

        <div className="bg-[#D1E7D8] border border-[#256250] text-[#256250] text-sm p-4 rounded-lg leading-7 mb-6">
          <p>
            <strong>نوع دوره:</strong> {state.duration}
          </p>
          <p>
            <strong>مربی:</strong> {state.coach}
          </p>
          <p>
            <strong>روز:</strong> {state.day}
          </p>
          <p>
            <strong>سطح:</strong> {state.level}
          </p>
          <p>
            <strong>قیمت:</strong> {state.price}
          </p>
        </div>

        <Formik
          initialValues={{ cardNumber: "", cvv2: "", expiry: "", otp: "" }}
          validationSchema={PaymentSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 text-sm text-[#256250] text-right">
              <div>
                <label className="block mb-1 font-semibold">شماره کارت</label>
                <Field
                  name="cardNumber"
                  type="text"
                  placeholder="1234567812345678"
                  className="w-full px-4 py-2 border border-[#D1E7D8] rounded-md focus:ring-2 focus:ring-[#FF6600] outline-none"
                />
                <ErrorMessage
                  name="cardNumber"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="block mb-1 font-semibold">CVV2</label>
                  <Field
                    name="cvv2"
                    type="text"
                    className="w-full px-3 py-2 border border-[#D1E7D8] rounded-md focus:ring-2 focus:ring-[#FF6600] outline-none"
                  />
                  <ErrorMessage
                    name="cvv2"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 font-semibold">
                    تاریخ انقضا
                  </label>
                  <Field
                    name="expiry"
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-[#D1E7D8] rounded-md focus:ring-2 focus:ring-[#FF6600] outline-none"
                  />
                  <ErrorMessage
                    name="expiry"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="w-full bg-gradient-to-r from-[#055B5C] to-[#063f40] text-white font-semibold py-2 rounded-md hover:brightness-110 transition cursor-pointer"
                >
                  دریافت رمز پویا
                </button>
              ) : (
                <div>
                  <label className="block mb-1 font-semibold">رمز پویا</label>
                  <Field
                    name="otp"
                    type="text"
                    placeholder="مثلاً 123456"
                    className="w-full px-4 py-2 border border-[#D1E7D8] rounded-md focus:ring-2 focus:ring-[#FF6600] outline-none"
                  />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !otpSent}
                className={`w-full py-2 rounded-md font-bold transition text-white ${
                  otpSent
                    ? "bg-[#256250] hover:bg-[#1c4e40]"
                    : "bg-[#CCCCCC] cursor-not-allowed"
                }`}
              >
                پرداخت و ثبت خرید
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PaymentPage;
