import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import { useUserProfile } from "../../context/UserProfileContext";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("نام الزامی است"),
  birthDate: Yup.string()
    .required("تاریخ تولد الزامی است")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید yyyy-mm-dd باشد"),
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره تلفن معتبر نیست")
    .required("شماره تلفن الزامی است"),
  medicalCondition: Yup.string().required("شرایط پزشکی الزامی است"),
  goal: Yup.string().required("هدف ورزشی الزامی است"),
});

const ProfileInfoCard = () => {
  const { updateUserInfo } = useUserProfile();
  const [editMode, setEditMode] = useState(false);
  const [age, setAge] = useState(null);

  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem("userProfile");
    return storedData
      ? JSON.parse(storedData)
      : {
          name: "",
          birthDate: "",
          phone: "",
          medicalCondition: "",
          goal: "",
        };
  });

  useEffect(() => {
    // اگر داده‌ای نبود، داده تستی قرار بده
    const stored = localStorage.getItem("userProfile");
    if (!stored) {
      const mockData = {
        name: "آزاده ملکی",
        birthDate: "1992-07-15",
        phone: "09121234567",
        medicalCondition: "مشکلات کمر",
        goal: "تناسب اندام و افزایش انعطاف‌پذیری",
      };
      localStorage.setItem("userProfile", JSON.stringify(mockData));
      setFormData(mockData);
    }
  }, []);

  useEffect(() => {
    if (formData.birthDate) {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      setAge(currentYear - birthYear);
    }
  }, [formData.birthDate]);

  const fields = [
    { name: "name", label: "نام" },
    { name: "birthDate", label: "تاریخ تولد (yyyy-mm-dd)" },
    { name: "phone", label: "شماره تلفن" },
    { name: "medicalCondition", label: "شرایط پزشکی" },
    { name: "goal", label: "هدف ورزشی" },
  ];

  const handleSubmit = (values) => {
    localStorage.setItem("userProfile", JSON.stringify(values));
    updateUserInfo(values);
    setFormData(values);
    setEditMode(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleDateString("fa-IR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "نامشخص";
  };

  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative w-full max-sm:w-[350px] max-w-full min-[800px]:max-w-[400px] min-w-[250px] mt-15
        mx-2 sm:mx-4 font-[Tahoma] text-right border border-[#D1E7D8] rounded-4xl shadow-md p-3 max-sm:p-2 sm:p-3 rtl transition-colors
        duration-300 bg-[#9FC6C3] box-border ${
          editMode ? "h-auto" : "h-[400px]"
        }`}
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
            initialValues={formData}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <Form className="flex flex-col space-y-2 h-full text-[11px] mt-6 text-right">
                <div className="flex flex-col gap-2">
                  {fields.map((field, idx) => (
                    <div key={idx}>
                      <label className="text-gray-800 font-bold block mb-0 text-[11px]">
                        {field.label}:
                      </label>
                      <Field
                        name={field.name}
                        type={field.name === "birthDate" ? "date" : "text"}
                        className="w-full px-1 py-0.5 border border-gray-200 rounded-md text-[11px] text-right"
                      />
                      <div className="min-h-[12px]">
                        <ErrorMessage
                          name={field.name}
                          component="div"
                          className="text-red-600 text-[8px] mt-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#055B5C] text-white py-1 rounded-md hover:bg-[#1E4D43] transition text-[11px]"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="flex flex-col justify-between h-full pt-16 space-y-1.5 text-gray-800 text-[18px] leading-relaxed -mt-5">
            <h2 className="text-[#FF6600] font-extrabold text-[20px] border-b border-white pb-1">
              {formData.name || "نام"}
            </h2>
            <div className="space-y-1.5">
              <p>
                <strong className="text-[#256250]">تاریخ تولد:</strong>{" "}
                {formData.birthDate
                  ? `${formatDate(formData.birthDate)} (${age} ساله)`
                  : "نامشخص"}
              </p>
              <p>
                <strong className="text-[#256250]">شماره تلفن:</strong>{" "}
                <a
                  href={`tel:${formData.phone}`}
                  className="text-[#256250] hover:underline font-semibold"
                >
                  {formData.phone || "نامشخص"}
                </a>
              </p>
              <p>
                <strong className="text-[#256250]">شرایط پزشکی:</strong>{" "}
                {formData.medicalCondition || "نامشخص"}
              </p>
              <p>
                <strong className="text-[#256250]">هدف ورزشی:</strong>{" "}
                {formData.goal || "نامشخص"}
              </p>
            </div>
            <div className="pt-2 border-t border-white">
              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-[#055B5C] text-white py-1 rounded-md hover:bg-[#1E4D43] text-[12px] transition cursor-pointer"
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
