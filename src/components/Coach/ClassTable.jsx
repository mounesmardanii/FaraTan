// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useReservations } from "../../context/ReservationContext"; // ✅ اضافه شد

// const initialClasses = [
//   { id: 1, day: "شنبه", time: "15 - 17", status: "تکمیل شده" },
//   { id: 2, day: "پنجشنبه", time: "11 - 13", status: "ظرفیت دارد" },
//   { id: 3, day: "دوشنبه", time: "8 - 10", status: "ظرفیت دارد" },
//   { id: 4, day: "دوشنبه", time: "11 - 13", status: "تکمیل شده" },
// ];

// const rowVariants = {
//   hidden: { opacity: 0, x: 50 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     x: 0,
//     transition: {
//       delay: i * 0.15,
//       duration: 0.6,
//       ease: "easeOut",
//     },
//   }),
// };

// const ClassTable = () => {
//   const [classes] = useState(initialClasses);

//   const { reserveClass } = useReservations(); // ✅ اضافه شد

//   const handleReserve = (classItem) => {
//     if (classItem.status === "ظرفیت دارد") {
//       reserveClass(classItem); // ✅ حالا درست کار می‌کنه
//       alert(
//         `کلاس ${classItem.day} در ساعت ${classItem.time} با موفقیت رزرو شد.`
//       );
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className="bg-[#FEEDDB] p-4 max-sm:p-3 sm:p-5 md:p-6 rounded-2xl shadow-lg w-full max-w-[900px] lg:max-w-[1100px] xl:max-w-[1300px] min-w-[300px] h-[400px] mx-auto mt-15 font-[Tahoma] text-right border border-[#D1E7D8] overflow-hidden"
//     >
//       <h3 className="text-[#256250] border-b-2 border-[#FF6600] pb-2 mb-4 text-base sm:text-lg md:text-xl font-bold text-center">
//         لیست کلاس‌های مربی
//       </h3>

//       <table className="w-full table-fixed border-collapse h-[calc(100%-64px)] rounded-xl overflow-hidden">
//         <thead className="text-[#FF6600] text-[14px] sm:text-[12px] md:text-[16px]">
//           <tr>
//             <th className="p-2 text-center border-b border-[#B5D2C1]">رزرو</th>
//             <th className="p-2 text-center border-b border-[#B5D2C1]">وضعیت</th>
//             <th className="p-2 text-center border-b border-[#B5D2C1]">ساعت</th>
//             <th className="p-2 text-center border-b border-[#B5D2C1]">روز</th>
//             <th className="p-2 text-center border-b border-[#B5D2C1]">
//               نوع کلاس
//             </th>
//           </tr>
//         </thead>

//         <tbody className="text-[10px] sm:text-[11px] md:text-[12px]">
//           {[...classes].reverse().map((item, index) => (
//             <motion.tr
//               key={item.id}
//               custom={index}
//               initial="hidden"
//               animate="visible"
//               variants={rowVariants}
//               className="bg-[#FFF8ED] border-b border-[#EBD9BD] hover:bg-[#FDF2E1] transition"
//             >
//               <td className="p-2 text-center">
//                 <button
//                   onClick={() => handleReserve(item)}
//                   disabled={item.status === "تکمیل شده"}
//                   className={`px-2 py-1 rounded-xl text-sm w-full max-w-[90px] mx-auto transition ${
//                     item.status === "تکمیل شده"
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-[#D1E7D8] text-[#256250] hover:bg-[#BFDCCC] cursor-pointer"
//                   }`}
//                 >
//                   رزرو
//                 </button>
//               </td>

//               <td className="p-2 text-center">
//                 <span
//                   className={`text-white px-3 py-1 rounded-xl text-sm whitespace-nowrap ${
//                     item.status === "تکمیل شده"
//                       ? "bg-[#FF6600]"
//                       : "bg-[#256250]"
//                   }`}
//                 >
//                   {item.status}
//                 </span>
//               </td>

//               <td className="p-2 text-center">{item.time}</td>
//               <td className="p-2 text-center">{item.day}</td>
//               <td className="p-2 text-center text-[#256250] font-medium">
//                 بدنسازی
//               </td>
//             </motion.tr>
//           ))}
//         </tbody>
//       </table>
//     </motion.div>
//   );
// };

// export default ClassTable;
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useReservations } from "../../context/ReservationContext";

const initialClasses = [
  { id: 1, day: "شنبه", time: "15 - 17", status: "تکمیل شده" },
  { id: 2, day: "پنجشنبه", time: "11 - 13", status: "ظرفیت دارد" },
  { id: 3, day: "دوشنبه", time: "8 - 10", status: "ظرفیت دارد" },
  { id: 4, day: "دوشنبه", time: "11 - 13", status: "تکمیل شده" },
];

const rowVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ClassTable = () => {
  const [classes] = useState(initialClasses);
  const { reservations, reserveClass } = useReservations();

  const handleReserve = (classItem) => {
    const alreadyReserved = reservations.some((r) => r.id === classItem.id);
    if (classItem.status === "ظرفیت دارد" && !alreadyReserved) {
      reserveClass(classItem);
      alert(
        `کلاس ${classItem.day} در ساعت ${classItem.time} با موفقیت رزرو شد.`
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#FEEDDB] p-4 max-sm:p-3 sm:p-5 md:p-6 rounded-2xl shadow-lg w-full max-w-[900px] lg:max-w-[1100px] xl:max-w-[1300px] min-w-[300px] h-[400px] mx-auto mt-15 font-[Tahoma] text-right border border-[#D1E7D8] overflow-hidden"
    >
      <h3 className="text-[#256250] border-b-2 border-[#FF6600] pb-2 mb-4 text-base sm:text-lg md:text-xl font-bold text-center">
        لیست کلاس‌های مربی
      </h3>

      <table className="w-full table-fixed border-collapse h-[calc(100%-64px)] rounded-xl overflow-hidden">
        <thead className="text-[#FF6600] text-[14px] sm:text-[12px] md:text-[16px]">
          <tr>
            <th className="p-2 text-center border-b border-[#B5D2C1]">رزرو</th>
            <th className="p-2 text-center border-b border-[#B5D2C1]">وضعیت</th>
            <th className="p-2 text-center border-b border-[#B5D2C1]">ساعت</th>
            <th className="p-2 text-center border-b border-[#B5D2C1]">روز</th>
            <th className="p-2 text-center border-b border-[#B5D2C1]">
              نوع کلاس
            </th>
          </tr>
        </thead>

        <tbody className="text-[10px] sm:text-[11px] md:text-[12px]">
          {[...classes].reverse().map((item, index) => {
            const isReserved = reservations.some((r) => r.id === item.id);
            return (
              <motion.tr
                key={item.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="bg-[#FFF8ED] border-b border-[#EBD9BD] hover:bg-[#FDF2E1] transition"
              >
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleReserve(item)}
                    disabled={item.status === "تکمیل شده" || isReserved}
                    className={`px-2 py-1 rounded-xl text-sm w-full max-w-[90px] mx-auto transition ${
                      item.status === "تکمیل شده" || isReserved
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#D1E7D8] text-[#256250] hover:bg-[#BFDCCC] cursor-pointer"
                    }`}
                  >
                    {isReserved ? "رزرو شده" : "رزرو"}
                  </button>
                </td>

                <td className="p-2 text-center">
                  <span
                    className={`text-white px-3 py-1 rounded-xl text-sm whitespace-nowrap ${
                      item.status === "تکمیل شده"
                        ? "bg-[#FF6600]"
                        : "bg-[#256250]"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-2 text-center">{item.time}</td>
                <td className="p-2 text-center">{item.day}</td>
                <td className="p-2 text-center text-[#256250] font-medium">
                  بدنسازی
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ClassTable;
