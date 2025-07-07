import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import { useUserProfile } from "../../context/UserProfileContext"; // ✅

const validationSchema = Yup.object().shape({
  name: Yup.string().required("نام الزامی است"),
  age: Yup.number().required("سن الزامی است").positive("عدد معتبر نیست"),
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره تلفن معتبر نیست")
    .required("شماره تلفن الزامی است"),
  medicalCondition: Yup.string().required("شرایط پزشکی الزامی است"),
  dietHistory: Yup.string().required("سابقه رژیم الزامی است"),
  exerciseHistory: Yup.string().required("سابقه ورزشی الزامی است"),
});

const ProfileInfoCard = () => {
  const { userProfile, updateUserInfo } = useUserProfile(); // ✅
  const [editMode, setEditMode] = useState(false);

  const fields = [
    "name",
    "age",
    "phone",
    "medicalCondition",
    "dietHistory",
    "exerciseHistory",
  ];

  const handleSubmit = (values) => {
    updateUserInfo(values); // ✅ ذخیره در context
    setEditMode(false);
  };

  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-sm:w-[350px] max-w-full min-[800px]:max-w-[400px] min-w-[250px] h-[400px] mt-15
        mx-2 sm:mx-4 font-[Tahoma] text-right border border-[#D1E7D8] rounded-4xl shadow-md p-3 max-sm:p-2 sm:p-3 rtl transition-colors
        duration-300 bg-[#9FC6C3] box-border"
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          src={assets.woman1}
          className="w-30 h-30 object-cover rounded-xl absolute -left-12 -top-15 z-10"
        />

        {editMode ? (
          <Formik
            enableReinitialize
            initialValues={userProfile}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <Form className="flex flex-col h-full text-[11px] sm:text-[11px] mt-6 text-right">
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  {fields.map((field, idx) => (
                    <div key={idx}>
                      <label className="text-gray-800 font-bold block mb-0 text-[11px] sm:text-[11px]">
                        {field === "name"
                          ? ": نام"
                          : field === "age"
                          ? ": سن"
                          : field === "phone"
                          ? ": شماره تلفن"
                          : field === "medicalCondition"
                          ? ": شرایط پزشکی"
                          : field === "dietHistory"
                          ? ": سابقه رژیم"
                          : ": سابقه ورزشی"}
                      </label>
                      <Field
                        name={field}
                        type={field === "age" ? "number" : "text"}
                        className="w-full px-1 py-0.5 border border-gray-200 rounded-md text-[11px] sm:text-[11px] text-right"
                      />
                      <div className="min-h-[12px]">
                        <ErrorMessage
                          name={field}
                          component="div"
                          className="text-red-600 text-[7px] sm:text-[8px] mt-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#055B5C] text-white py-1 rounded-md hover:bg-[#1E4D43] transition text-[11px] sm:text-[11px]"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="flex flex-col justify-between h-full pt-16 space-y-1.5 text-gray-800 text-[18px] sm:text-[16px] leading-relaxed -mt-5">
            <h2 className="text-[#FF6600] font-extrabold text-[20px] sm:text-[18px] border-b border-white pb-1">
              {userProfile.name}
            </h2>
            <div className="space-y-1.5">
              <p>
                <strong className="text-[#256250]">سن:</strong>{" "}
                {userProfile.age}
              </p>
              <p>
                <strong className="text-[#256250]">شماره تلفن:</strong>{" "}
                <a
                  href={`tel:${userProfile.phone}`}
                  className="text-[#256250] hover:underline font-semibold"
                >
                  {userProfile.phone}
                </a>
              </p>
              <p>
                <strong className="text-[#256250]">شرایط پزشکی:</strong>{" "}
                {userProfile.medicalCondition}
              </p>
              <p>
                <strong className="text-[#256250]">سابقه رژیم:</strong>{" "}
                {userProfile.dietHistory}
              </p>
              <p>
                <strong className="text-[#256250]">سابقه ورزشی:</strong>{" "}
                {userProfile.exerciseHistory}
              </p>
            </div>
            <div className="pt-2 border-t border-white">
              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-[#055B5C] text-white py-1 sm:py-2 rounded-md hover:bg-[#1E4D43] text-[12px] sm:text-base transition cursor-pointer"
              >
                ویرایش اطلاعات
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileInfoCard;
