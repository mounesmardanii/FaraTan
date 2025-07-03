import React, { useState } from "react";

const ProfileTable = () => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    height: 160,
    weight: 65,
    waist: 65,
    arm: 65,
    chest: 65,
    hip: 65,
  });

  const [formData, setFormData] = useState(profileData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfileData(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setEditMode(false);
  };

  const fields = [
    { key: "height", label: "قد" },
    { key: "weight", label: "وزن" },
    { key: "waist", label: "دور کمر" },
    { key: "arm", label: "دور بازو" },
    { key: "chest", label: "دور سینه" },
    { key: "hip", label: "دور باسن" },
  ];

  return (
    <div className="flex flex-col items-center w-full px-4 mt-6">
      <div className="bg-[#9FC6C3] w-full max-w-3xl rounded-xl p-4 sm:p-6 text-right shadow-md">
        <h2 className="text-white font-extrabold text-lg sm:text-xl mb-4 border-b border-white pb-2">
          جزئیات فیزیکی
        </h2>

        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-2 text-[#1F2D27] font-bold text-sm">
            {fields.map(({ key, label }) => (
              <div
                key={key}
                className="flex flex-col items-center text-center bg-white/10 p-2 rounded"
              >
                <span>{label}</span>
                {editMode ? (
                  <input
                    type="number"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="mt-1 w-20 px-2 py-1 rounded border border-gray-300 text-center text-sm"
                  />
                ) : (
                  <span className="mt-1 text-[15px]">{profileData[key]}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-center text-[#1F2D27] font-bold">
            <thead>
              <tr className="border-b border-gray-600">
                {fields.map(({ label }) => (
                  <th key={label} className="py-2">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-[15px]">
                {fields.map(({ key }) => (
                  <td key={key} className="py-2">
                    {editMode ? (
                      <input
                        type="number"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-16 px-1 py-0.5 rounded border border-gray-300 text-center text-sm"
                      />
                    ) : (
                      profileData[key]
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-[#256250] hover:bg-[#1E4D43] text-white px-4 py-2 rounded-md transition text-sm font-semibold w-full sm:w-auto"
              >
                ذخیره
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition text-sm font-semibold w-full sm:w-auto"
              >
                لغو
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="bg-[#FF6600] hover:bg-orange-600 text-white px-4 py-2 rounded-md transition text-sm font-semibold w-full sm:w-auto"
              >
                بروزرسانی
              </button>
              <button className="bg-[#FF6600] hover:bg-orange-600 text-white px-4 py-2 rounded-md transition text-sm font-semibold w-full sm:w-auto">
                نتایج تمرینات و تلاش‌ها
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTable;
