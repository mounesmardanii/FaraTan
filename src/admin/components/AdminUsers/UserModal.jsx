import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserModal({ user, onClose }) {
  const navigate = useNavigate();

  // بررسی و استخراج اطلاعات بدنی اگر داخل bodyMeasurements باشه
  const {
    weight,
    waist,
    hips,
    chest,
    arm,
    thigh
  } = user.bodyMeasurements || {};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50">
      <div
        dir="rtl"
        className="bg-[#FCEFE3] border-2 border-orange-500 rounded-[24px] p-4 w-[70%] md:w-full max-w-5xl relative text-right mt-80 md:ml-35"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-xl hover:text-red-700 cursor-pointer"
        >
          ✕
        </button>

        <div className="flex justify-end gap-2 mb-3">
          <button
            onClick={() => navigate('/admin/add-nutrition')}
            className="border border-green-700 text-green-700 px-2 py-1 rounded-full text-xs hover:bg-green-50 cursor-pointer"
          >
            افزودن برنامه غذایی
          </button>
          <button
            onClick={() => navigate('/admin/add-fitness')}
            className="border border-green-700 text-green-700 px-2 py-1 rounded-full text-xs hover:bg-green-50 cursor-pointer"
          >
            افزودن برنامه ورزشی
          </button>
        </div>

        {/* جدول دسکتاپ */}
        <table className="w-full text-xs font-bold text-[#055B5C] text-center hidden md:table">
          <thead>
            <tr className="border-b border-green-900">
              <th>پروفایل</th>
              <th>نام</th>
              <th>نام خانوادگی</th>
              <th>شماره تلفن</th>
              <th>تاریخ تولد</th>
              <th>شرایط پزشکی</th>
              <th>هدف ورزش</th>
              <th>قد</th>
              <th>وزن</th>
              <th>دور بازو</th>
              <th>دور سینه</th>
              <th>دور باسن</th>
              <th>دور کمر</th>
              <th>دور ران</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full mx-auto" /></td>
              <td>{user.name}</td>
              <td>{user.lastName}</td>
              <td>{user.phone}</td>
              <td>{user.birthDate}</td>
              <td>{user.medicalCondition}</td>
              <td>{user.sportGoal}</td>
              <td>{user.height}</td>
              <td>{weight}</td>
              <td>{arm}</td>
              <td>{chest}</td>
              <td>{hips}</td>
              <td>{waist}</td>
              <td>{thigh}</td>
            </tr>
          </tbody>
        </table>

        {/* موبایل */}
        <div className="block md:hidden text-xs font-bold text-[#055B5C] space-y-1 mt-2">
          <div className="flex items-center gap-2">
            <span>پروفایل:</span>
            <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full" />
          </div>
          <div>نام: {user.name}</div>
          <div>نام خانوادگی: {user.lastName}</div>
          <div>شماره تلفن: {user.phone}</div>
          <div>تاریخ تولد: {user.birthDate}</div>
          <div>شرایط پزشکی: {user.medicalCondition}</div>
          <div>هدف ورزش: {user.sportGoal}</div>
          <div>قد: {user.height}</div>
          <div>وزن: {weight}</div>
          <div>دور بازو: {arm}</div>
          <div>دور سینه: {chest}</div>
          <div>دور باسن: {hips}</div>
          <div>دور کمر: {waist}</div>
          <div>دور ران: {thigh}</div>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
