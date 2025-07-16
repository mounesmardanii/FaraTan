import React from 'react';
import { assets } from '../../../assets/assets';

function UserTable({
  users,
  formData,
  setFormData,
  handleEdit,
  handleSaveEdit,
  handleDeleteUser,
  resetForm,
  editIndex,
  setSelectedUser,
}) {
  return (
    <div className="w-full bg-[#D1E7D8] rounded-2xl p-4">
      {/* دسکتاپ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm text-[#055B5C] text-center font-medium border border-[#D1E7D8] rounded-xl overflow-hidden">
          <thead className="bg-[#eaf4ef] border-b border-[#D1E7D8] text-[#055B5C]">
            <tr>
              <th className="py-3 px-4">پروفایل</th>
              <th className="py-3 px-4">نام</th>
              <th className="py-3 px-4">نام خانوادگی</th>
              <th className="py-3 px-4">تاریخ تولد</th>
              <th className="py-3 px-4">شماره تلفن</th>
              <th className="py-3 px-4">شرایط پزشکی</th>
              <th className="py-3 px-4">هدف ورزش</th>
              <th className="py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isEditing = editIndex === u.id;
              return (
                <tr key={u.id} className="bg-[#eaf4ef] border-b border-[#D1E7D8] hover:bg-[#f4fdf8] transition">
                  <td className="py-3 px-4">
                    <img src={u.avatar} alt="avatar" className="w-9 h-9 rounded-full mx-auto border-2 border-white shadow-md" />
                  </td>

                  {isEditing ? (
                    <>
                      <td className="py-3 px-4">
                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="نام" />
                      </td>
                      <td className="py-3 px-4">
                        <input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="نام خانوادگی" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="text" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="تاریخ تولد" />
                      </td>
                      <td className="py-3 px-4">
                        <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="شماره تلفن" />
                      </td>
                      <td className="py-3 px-4">
                        <input value={formData.medicalCondition} onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="شرایط پزشکی" />
                      </td>
                      <td className="py-3 px-4">
                        <input value={formData.sportGoal} onChange={(e) => setFormData({ ...formData, sportGoal: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="هدف ورزش" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={handleSaveEdit} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 cursor-pointer">ذخیره</button>
                          <button onClick={resetForm} className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 cursor-pointer">لغو</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="py-3 px-4">{u.lastName}</td>
                      <td className="py-3 px-4">{u.birthDate}</td>
                      <td className="py-3 px-4">{u.phone}</td>
                      <td className="py-3 px-4">{u.medicalCondition}</td>
                      <td className="py-3 px-4">{u.sportGoal}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEdit(u)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 cursor-pointer">ویرایش</button>
                          <button onClick={() => handleDeleteUser(u.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 cursor-pointer">حذف</button>
                          <button onClick={() => setSelectedUser(u)} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 cursor-pointer">نمایش</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* موبایل */}
      <div className="flex flex-col gap-4 md:hidden mt-4">
        {users.map((u) => (
          <div key={u.id} className="bg-[#eaf4ef] rounded-xl border border-[#D1E7D8] p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-bold text-[#055B5C]">{u.name} {u.lastName}</div>
              <img src={u.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" />
            </div>

            {editIndex === u.id ? (
              <>
                <div className="flex flex-col gap-2">
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-3 py-1 border rounded-md text-xs" placeholder="نام" />
                  <input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="px-3 py-1 border rounded-md text-xs" placeholder="نام خانوادگی" />
                  <input value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="px-3 py-1 border rounded-md text-xs" placeholder="تاریخ تولد" />
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="px-3 py-1 border rounded-md text-xs" placeholder="شماره تلفن" />
                  <input value={formData.medicalCondition} onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })} className="px-3 py-1 border rounded-md text-xs" placeholder="شرایط پزشکی" />
                  <input value={formData.sportGoal} onChange={(e) => setFormData({ ...formData, sportGoal: e.target.value })} className="px-3 py-1 border rounded-md text-xs" placeholder="هدف ورزش" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={handleSaveEdit} className="bg-green-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-600 cursor-pointer">ذخیره</button>
                  <button onClick={resetForm} className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-lg hover:bg-gray-400 cursor-pointer">لغو</button>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-[#055B5C] space-y-1">
                  <div><strong>تاریخ تولد:</strong> {u.birthDate}</div>
                  <div><strong>شماره تلفن:</strong> {u.phone}</div>
                  <div><strong>شرایط پزشکی:</strong> {u.medicalCondition}</div>
                  <div><strong>هدف ورزش:</strong> {u.sportGoal}</div>
                </div>
                <div className="flex justify-end flex-wrap gap-2 pt-2">
                  <button onClick={() => handleEdit(u)} className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-lg hover:bg-blue-200 cursor-pointer">ویرایش</button>
                  <button onClick={() => handleDeleteUser(u.id)} className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg hover:bg-red-200 cursor-pointer">حذف</button>
                  <button onClick={() => setSelectedUser(u)} className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-lg hover:bg-yellow-200 cursor-pointer">نمایش</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserTable;
