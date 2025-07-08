import React from 'react';
import { assets } from '../../../assets/assets';

function UserTable({
  users,
  formData,
  setFormData,
  handleAddUser,
  handleEdit,
  handleSaveEdit,
  handleDeleteUser,
  handleAddNewClick,
  resetForm,
  editIndex,
  addingNew,
  setSelectedUser,
}) {
  const renderInputCell = (key) => (
    <td key={key} className="py-2 px-1 md:px-2">
      <input
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        className="w-full px-1 md:px-2 py-1 border rounded text-[10px] md:text-xs text-right truncate"
        placeholder={key === 'name' ? 'نام' : key === 'lastName' ? 'نام خانوادگی' : key === 'sport' ? 'ورزش' : 'دوره'}
      />
    </td>
  );

  return (
    <div className="w-full">
      <table className="w-full text-[10px] md:text-xs text-[#055B5C] text-center font-semibold table-fixed">
        <thead>
          <tr className="bg-[#EAF4EF] border-b border-[#ccc]">
            <th className="py-2 px-1 md:px-2 w-[10%]">پروفایل</th>
            <th className="py-2 px-1 md:px-2 w-[20%]">نام</th>
            <th className="py-2 px-1 md:px-2 w-[20%]">نام خانوادگی</th>
            <th className="py-2 px-1 md:px-2 w-[20%]">ورزش</th>
            <th className="py-2 px-1 md:px-2 w-[20%]">دوره</th>
            <th className="py-2 px-1 md:px-2 w-[20%]">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="bg-[#EAF4EF] border-b border-[#ccc]">
              <td className="py-2 px-1 md:px-2">
                <img src={u.avatar} alt="avatar" className="w-6 h-6 md:w-8 md:h-8 rounded-full mx-auto" />
              </td>
              {editIndex === u.id ? (
                <>
                  {["name", "lastName", "sport", "course"].map(renderInputCell)}
                  <td className="py-2 px-1 md:px-2">
                    <div className="flex gap-1 md:gap-2 justify-center flex-wrap">
                      <button onClick={handleSaveEdit} className="cursor-pointer text-green-600 bg-green-100 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-green-200 transition">ذخیره</button>
                      <button onClick={resetForm} className="cursor-pointer text-gray-600 bg-gray-200 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-gray-300 transition">لغو</button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-1 md:px-2 truncate">{u.name}</td>
                  <td className="py-2 px-1 md:px-2 truncate">{u.lastName}</td>
                  <td className="py-2 px-1 md:px-2 truncate">{u.sport}</td>
                  <td className="py-2 px-1 md:px-2 truncate">{u.course}</td>
                  <td className="py-2 px-1 md:px-2">
                    <div className="flex flex-col md:flex-row gap-1 md:gap-2 justify-center items-center">
                      <button onClick={() => handleEdit(u)} className="cursor-pointer text-blue-600 bg-blue-100 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-blue-200 transition">ویرایش</button>
                      <button onClick={() => handleDeleteUser(u.id)} className="cursor-pointer text-red-600 bg-red-100 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-red-200 transition">حذف</button>
                      <button onClick={() => setSelectedUser(u)} className="cursor-pointer text-yellow-600 bg-yellow-100 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-yellow-200 transition">نمایش</button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}

          {addingNew && (
            <tr className="bg-[#F9F9F9] border-t">
              <td className="py-2 px-1 md:px-2">
                <img src={assets.woman4} alt="avatar" className="w-6 h-6 md:w-8 md:h-8 rounded-full mx-auto" />
              </td>
              {["name", "lastName", "sport", "course"].map(renderInputCell)}
              <td className="py-2 px-1 md:px-2">
                <div className="flex gap-1 md:gap-2 justify-center flex-wrap">
                  <button onClick={handleAddUser} className="cursor-pointer text-green-600 bg-green-100 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-green-200 transition">ثبت</button>
                  <button onClick={resetForm} className="cursor-pointer text-gray-600 bg-gray-200 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-gray-300 transition">لغو</button>
                </div>
              </td>
            </tr>
          )}

          {!addingNew && !editIndex && (
            <tr key="add-row" className="bg-[#EAF4EF]">
              <td colSpan="6" className="text-center py-4">
                <button
                  onClick={handleAddNewClick}
                  className="cursor-pointer text-2xl md:text-3xl text-green-600 hover:text-green-700 transition"
                >
                  +
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;