import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("نام الزامی است"),
  age: Yup.number().required("سن الزامی است").positive("عدد معتبر نیست"),
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره تلفن معتبر نیست")
    .required("شماره تلفن الزامی است"),
  specialty: Yup.string().required("تخصص الزامی است"),
  experience: Yup.string().required("سابقه الزامی است"),
});

const CoachInfoCard = () => {
  const [editMode, setEditMode] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    age: "",
    phone: "",
    specialty: "",
    experience: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("coach"));
    if (saved) {
      setInitialValues(saved);
    } else {
      setInitialValues({
        name: "مریم عبدی",
        age: 31,
        phone: "09116868921",
        specialty: "یوگا",
        experience: "۸ سال",
      });
    }
  }, []);

  const handleSubmit = (values) => {
    localStorage.setItem("coach", JSON.stringify(values));
    setInitialValues(values);
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
        duration-300 bg-[#D1E7D8] box-border"
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
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <Form className="flex flex-col h-full text-[12px] sm:text-xs mt-8">
                <div className="flex flex-col gap-1.5 overflow-hidden">
                  {["name", "age", "phone", "specialty", "experience"].map(
                    (field, idx) => (
                      <div key={idx}>
                        <label className="text-gray-800 font-bold block mb-0.5 text-[12px] sm:text-sm">
                          {field === "name"
                            ? ": نام"
                            : field === "age"
                            ? ": سن"
                            : field === "phone"
                            ? ": شماره تلفن"
                            : field === "specialty"
                            ? ": تخصص"
                            : ": سابقه"}
                        </label>
                        <Field
                          name={field}
                          type={field === "age" ? "number" : "text"}
                          className="w-full px-2 py-0.5 border border-[#B5D2C1] rounded-md text-[12px] sm:text-xs"
                        />
                        <div className="min-h-[14px]">
                          <ErrorMessage
                            name={field}
                            component="div"
                            className="text-red-600 text-[10px] sm:text-[10px] mt-0.5"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-1.5">
                  <button
                    type="submit"
                    className="w-full bg-[#256250] text-white py-1 rounded-md hover:bg-[#1E4D43] transition text-[12px] sm:text-xs cursor-pointer"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="flex flex-col justify-between h-full pt-16 space-y-1.5 text-gray-800 text-[18px] sm:text-[16px] leading-relaxed -mt-5">
            <h2 className="text-[#FF6600] font-extrabold text-[20px] sm:text-[18px] border-b border-[#ccc] pb-1">
              {initialValues.name}
            </h2>
            <div className="space-y-1.5">
              <p>
                <strong className="text-[#256250]">سن:</strong>{" "}
                {initialValues.age}
              </p>
              <p>
                <strong className="text-[#256250]">شماره تلفن:</strong>{" "}
                <a
                  href={`tel:${initialValues.phone}`}
                  className="text-[#256250] hover:underline font-semibold"
                >
                  {initialValues.phone}
                </a>
              </p>
              <p>
                <strong className="text-[#256250]">تخصص:</strong>{" "}
                {initialValues.specialty}
              </p>
              <p>
                <strong className="text-[#256250]">سابقه:</strong>{" "}
                {initialValues.experience}
              </p>
            </div>
            <div className="pt-2 border-t border-[#ccc]">
              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-[#256250] text-white py-1 sm:py-2 rounded-md hover:bg-[#1E4D43] text-[12px] sm:text-base transition cursor-pointer"
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

export default CoachInfoCard;
