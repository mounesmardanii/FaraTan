// UserTable.jsx
import React from 'react';
import { assets } from '../../assets/assets';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateObject from 'react-date-object';

function UserTable({
  users,
  formData,
  setFormData,
  handleEdit,
  handleSaveEdit,
  handleDeleteUser,
  handleAddUser,
  resetForm,
  editIndex,
  addingNew,
  setAddingNew,
  setSelectedUser,
}) {
  return (
    <div className="w-full bg-[#D1E7D8] rounded-2xl p-4 overflow-visible">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="min-w-full text-sm text-[#055B5C] text-center font-medium border border-[#D1E7D8] rounded-xl">
          <thead className="bg-[#eaf4ef] border-b border-[#D1E7D8] text-[#055B5C]">
            <tr>
              <th className="py-3 px-4">پروفایل</th>
              <th className="py-3 px-4">نام</th>
              <th className="py-3 px-4">نام خانوادگی</th>
              <th className="py-3 px-4">تاریخ تولد</th>
              <th className="py-3 px-4">شماره تلفن</th>
              <th className="py-3 px-4">شرایط پزشکی</th>
              <th className="py-3 px-4">هدف ورزش</th>
              <th className="py-3 px-4">نوع دوره</th>
              <th className="py-3 px-4">تعداد جلسات</th>
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
                      <td className="py-3 px-4"><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="نام" /></td>
                      <td className="py-3 px-4"><input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="نام خانوادگی" /></td>
                      <td className="py-3 px-4">
                        <DatePicker
                          calendar={persian}
                          locale={persian_fa}
                          value={formData.birthDate ? new DateObject(formData.birthDate) : null}
                          onChange={(date) => setFormData({ ...formData, birthDate: date?.toDate?.() || '' })}
                          inputClass="w-full px-3 py-1 border rounded text-xs"
                        />
                      </td>
                      <td className="py-3 px-4"><input type="tel" inputMode="numeric" pattern="[0-9]*" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })} className="w-full px-3 py-1 border rounded text-xs" placeholder="شماره تلفن" /></td>
                      <td className="py-3 px-4"><input value={formData.medicalCondition} onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="شرایط پزشکی" /></td>
                      <td className="py-3 px-4"><input value={formData.sportGoal} onChange={(e) => setFormData({ ...formData, sportGoal: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="هدف ورزش" /></td>
                      <td className="py-3 px-4">
                        <select value={formData.courseType || 'عمومی'} onChange={(e) => setFormData({ ...formData, courseType: e.target.value })} className="w-full px-3 py-1 border rounded text-xs">
                          <option value="عمومی">عمومی</option>
                          <option value="خصوصی">خصوصی</option>
                          <option value="VIP">VIP</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input type="number" value={formData.sessionCount || ''} onChange={(e) => setFormData({ ...formData, sessionCount: e.target.value.replace(/[^0-9]/g, '') })} className="w-full px-3 py-1 border rounded text-xs" placeholder="تعداد جلسات" />
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
                      <td className="py-3 px-4">{u.birthDate ? new DateObject(u.birthDate).format("YYYY/MM/DD") : ''}</td>
                      <td className="py-3 px-4">{u.phone}</td>
                      <td className="py-3 px-4">{u.medicalCondition}</td>
                      <td className="py-3 px-4">{u.sportGoal}</td>
                      <td className="py-3 px-4">{u.courseType}</td>
                      <td className="py-3 px-4">{u.sessionCount}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEdit(u)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 cursor-pointer">ویرایش</button>
                          <button onClick={() => handleDeleteUser(u.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 cursor-pointer">حذف</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
            {addingNew && (
              <tr className="bg-white border-t border-[#ccc]">
                <td><img src={formData.avatar} alt="avatar" className="w-9 h-9 rounded-full mx-auto border shadow" /></td>
                <td><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="نام" /></td>
                <td><input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="نام خانوادگی" /></td>
                <td>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={formData.birthDate ? new DateObject(formData.birthDate) : null}
                    onChange={(date) => setFormData({ ...formData, birthDate: date?.toDate?.() || '' })}
                    inputClass="w-full px-3 py-1 border rounded text-xs"
                  />
                </td>
                <td><input type="tel" inputMode="numeric" pattern="[0-9]*" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })} className="w-full px-3 py-1 border rounded text-xs" placeholder="شماره تلفن" /></td>
                <td><input value={formData.medicalCondition} onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="شرایط پزشکی" /></td>
                <td><input value={formData.sportGoal} onChange={(e) => setFormData({ ...formData, sportGoal: e.target.value })} className="w-full px-3 py-1 border rounded text-xs" placeholder="هدف ورزش" /></td>
                <td>
                  <select value={formData.courseType || 'عمومی'} onChange={(e) => setFormData({ ...formData, courseType: e.target.value })} className="w-full px-3 py-1 border rounded text-xs">
                    <option value="عمومی">عمومی</option>
                    <option value="خصوصی">خصوصی</option>
                    <option value="VIP">VIP</option>
                  </select>
                </td>
                <td>
                  <input type="number" value={formData.sessionCount || ''} onChange={(e) => setFormData({ ...formData, sessionCount: e.target.value.replace(/[^0-9]/g, '') })} className="w-full px-3 py-1 border rounded text-xs" placeholder="تعداد جلسات" />
                </td>
                <td>
                  <div className="flex gap-2 justify-center">
                    <button onClick={handleAddUser} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 cursor-pointer">افزودن</button>
                    <button onClick={resetForm} className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 cursor-pointer">لغو</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!addingNew && !editIndex && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setFormData({
                  name: '',
                  lastName: '',
                  phone: '',
                  birthDate: '',
                  medicalCondition: '',
                  sportGoal: '',
                  courseType: 'عمومی',
                  sessionCount: '',
                  avatar: assets.woman4,
                });
                setAddingNew(true);
              }}
              className="text-3xl text-green-600 hover:text-green-700 cursor-pointer"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Mobile Responsive View */}
      <div className="md:hidden flex flex-col gap-4">
        {users.map((u) =>
          editIndex === u.id ? (
            // حالت ویرایش برای موبایل
            <div key={u.id} className="bg-[#f1f8f4] rounded-xl p-4 shadow text-xs text-[#055B5C] space-y-2">
              <div className="flex items-center gap-2">
                <img src={formData.avatar} alt="avatar" className="w-10 h-10 rounded-full border" />
                <div className="font-bold">{formData.name} {formData.lastName}</div>
              </div>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-2 py-1 border rounded" placeholder="نام" />
              <input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-2 py-1 border rounded" placeholder="نام خانوادگی" />
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={formData.birthDate ? new DateObject(formData.birthDate) : null}
                onChange={(date) => setFormData({ ...formData, birthDate: date?.toDate?.() || '' })}
                inputClass="w-full px-2 py-1 border rounded text-xs"
              />
              <input type="tel" inputMode="numeric" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })} className="w-full px-2 py-1 border rounded" placeholder="شماره تلفن" />
              <input value={formData.medicalCondition} onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })} className="w-full px-2 py-1 border rounded" placeholder="شرایط پزشکی" />
              <input value={formData.sportGoal} onChange={(e) => setFormData({ ...formData, sportGoal: e.target.value })} className="w-full px-2 py-1 border rounded" placeholder="هدف ورزش" />
              <select value={formData.courseType || 'عمومی'} onChange={(e) => setFormData({ ...formData, courseType: e.target.value })} className="w-full px-2 py-1 border rounded">
                <option value="عمومی">عمومی</option>
                <option value="خصوصی">خصوصی</option>
                <option value="VIP">VIP</option>
              </select>
              <input type="number" value={formData.sessionCount || ''} onChange={(e) => setFormData({ ...formData, sessionCount: e.target.value.replace(/[^0-9]/g, '') })} className="w-full px-2 py-1 border rounded" placeholder="تعداد جلسات" />
              <div className="flex gap-2 justify-center mt-2">
                <button onClick={handleSaveEdit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">ذخیره</button>
                <button onClick={resetForm} className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400">لغو</button>
              </div>
            </div>
          ) : (
            // حالت نمایش معمولی موبایل
            <div key={u.id} className="bg-[#eaf4ef] rounded-xl p-4 shadow text-xs text-[#055B5C]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <img src={u.avatar} alt="avatar" className="w-10 h-10 rounded-full border" />
                  <div className="font-bold">{u.name} {u.lastName}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(u)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">ویرایش</button>
                  <button onClick={() => handleDeleteUser(u.id)} className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200">حذف</button>
                </div>
              </div>
              <div className="space-y-1">
                <div><strong>تاریخ تولد:</strong> {u.birthDate ? new DateObject(u.birthDate).format("YYYY/MM/DD") : ''}</div>
                <div><strong>شماره تلفن:</strong> {u.phone}</div>
                <div><strong>شرایط پزشکی:</strong> {u.medicalCondition}</div>
                <div><strong>هدف ورزش:</strong> {u.sportGoal}</div>
                <div><strong>نوع دوره:</strong> {u.courseType}</div>
                <div><strong>تعداد جلسات:</strong> {u.sessionCount}</div>
              </div>
            </div>
          )
        )}

        {addingNew && (
          <div className="bg-white rounded-xl p-4 shadow text-xs text-[#055B5C] space-y-2">
            <div className="flex items-center gap-2">
              <img src={formData.avatar} alt="avatar" className="w-10 h-10 rounded-full border" />
              <div className="font-bold">افزودن کاربر جدید</div>
            </div>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-2 py-1 border rounded" placeholder="نام" />
            <input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-2 py-1 border rounded" placeholder="نام خانوادگی" />
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={formData.birthDate ? new DateObject(formData.birthDate) : null}
              onChange={(date) => setFormData({ ...formData, birthDate: date?.toDate?.() || '' })}
              inputClass="w-full px-2 py-1 border rounded text-xs"
            />
            <input type="tel" inputMode="numeric" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })} className="w-full px-2 py-1 border rounded" placeholder="شماره تلفن" />
            <input value={formData.medicalCondition} onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })} className="w-full px-2 py-1 border rounded" placeholder="شرایط پزشکی" />
            <input value={formData.sportGoal} onChange={(e) => setFormData({ ...formData, sportGoal: e.target.value })} className="w-full px-2 py-1 border rounded" placeholder="هدف ورزش" />
            <select value={formData.courseType || 'عمومی'} onChange={(e) => setFormData({ ...formData, courseType: e.target.value })} className="w-full px-2 py-1 border rounded">
              <option value="عمومی">عمومی</option>
              <option value="خصوصی">خصوصی</option>
              <option value="VIP">VIP</option>
            </select>
            <input type="number" value={formData.sessionCount || ''} onChange={(e) => setFormData({ ...formData, sessionCount: e.target.value.replace(/[^0-9]/g, '') })} className="w-full px-2 py-1 border rounded" placeholder="تعداد جلسات" />
            <div className="flex gap-2 justify-center mt-2">
              <button onClick={handleAddUser} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 cursor-pointer">افزودن</button>
              <button onClick={resetForm} className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 cursor-pointer">لغو</button>
            </div>
          </div>
        )}

        {!addingNew && !editIndex && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setFormData({
                  name: '',
                  lastName: '',
                  phone: '',
                  birthDate: '',
                  medicalCondition: '',
                  sportGoal: '',
                  courseType: 'عمومی',
                  sessionCount: '',
                  avatar: assets.woman4,
                });
                setAddingNew(true);
              }}
              className="text-3xl text-green-600 hover:text-green-700 cursor-pointer"
            >
              +
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default UserTable;