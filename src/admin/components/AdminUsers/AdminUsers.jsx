import React, { useEffect, useState, useMemo } from 'react';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { assets } from '../../../assets/assets';

function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', lastName: '', sport: '', course: '' });
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    // داده آزمایشی - جایگزینی با API در آینده
    const dummy = [
      { name: 'غزل', lastName: 'نادری', sport: 'ایروبیک', course: 'یک ساله', avatar: assets.woman4 },
      { name: 'مونِس', lastName: 'مردانی', sport: 'ایروبیک', course: 'سه ماهه', avatar: assets.woman4 },
    ];
    setUsers(dummy);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const handleDelete = (index) => {
    const updated = [...users];
    updated.splice(index, 1);
    setUsers(updated);
    if (editIndex === index) setEditIndex(null);
  };

  const handleEditSave = (index) => {
    const updated = [...users];
    updated[index] = { ...newUser, avatar: assets.woman4 };
    setUsers(updated);
    setEditIndex(null);
  };

  const handleAddSave = () => {
    if (!newUser.name.trim() || !newUser.lastName.trim()) return;
    setUsers(prev => [...prev, { ...newUser, avatar: assets.woman4 }]);
    setNewUser({ name: '', lastName: '', sport: '', course: '' });
    setAddingNew(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-right">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 mt-4">
        <aside className="hidden md:flex mt-3 w-64 z-30 border-t-[3px] border-r-[3px] border-[#055B5C] rounded-tr-[75px]">
          <AdminSidebar />
        </aside>

        <main
          dir="rtl"
          className="flex-1 p-4 md:p-10 z-10 overflow-y-auto border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white flex flex-col gap-6 ml-10 text-right"
        >
          {/* سرچ بار */}
          <div className="flex items-center border-2 border-[#9FC6C3] rounded-full px-4 py-2 w-full max-w-md self-center">
            <input
              type="text"
              placeholder="نام را وارد کنید..."
              className="flex-1 outline-none bg-transparent text-right text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <h2 className="text-center text-orange-600 font-bold text-lg">لیست اعضای باشگاه</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-center text-sm text-[#055B5C] font-semibold">
              <thead>
                <tr className="bg-[#D1E7D8] border-b border-[#ccc]">
                  <th className="py-2">پروفایل</th>
                  <th className="py-2">نام</th>
                  <th className="py-2">نام خانوادگی</th>
                  <th className="py-2">ورزش</th>
                  <th className="py-2">دوره</th>
                  <th className="py-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr key={i} className="bg-[#EAF4EF] border-b border-[#ccc]">
                    <td className="py-2">
                      <img src={u.avatar} alt="avatar" className="w-10 h-10 rounded-full mx-auto" />
                    </td>
                    {editIndex === i ? (
                      <>
                        <td><input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" /></td>
                        <td><input value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" /></td>
                        <td><input value={newUser.sport} onChange={(e) => setNewUser({ ...newUser, sport: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" /></td>
                        <td><input value={newUser.course} onChange={(e) => setNewUser({ ...newUser, course: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" /></td>
                        <td className="flex gap-2 justify-center">
                          <button onClick={() => handleEditSave(i)} className="text-green-600 text-sm">ذخیره</button>
                          <button onClick={() => setEditIndex(null)} className="text-gray-500 text-sm">لغو</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{u.name}</td>
                        <td>{u.lastName}</td>
                        <td>{u.sport}</td>
                        <td>{u.course}</td>
                        <td className="flex gap-2 justify-center">
                          <button onClick={() => { setEditIndex(i); setNewUser(u); }} className="text-blue-600 text-sm">ویرایش</button>
                          <button onClick={() => handleDelete(i)} className="text-red-600 text-lg">✖</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {/* ردیف افزودن */}
                {addingNew && (
                  <tr className="bg-[#F9F9F9] border-t">
                    <td></td>
                    <td><input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" /></td>
                    <td><input value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" /></td>
                    <td><input value={newUser.sport} onChange={(e) => setNewUser({ ...newUser, sport: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" /></td>
                    <td><input value={newUser.course} onChange={(e) => setNewUser({ ...newUser, course: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" /></td>
                    <td className="flex gap-2 justify-center">
                      <button onClick={handleAddSave} className="text-green-600 text-sm">ثبت</button>
                      <button onClick={() => { setAddingNew(false); setNewUser({ name: '', lastName: '', sport: '', course: '' }); }} className="text-gray-500 text-sm">لغو</button>
                    </td>
                  </tr>
                )}

                {/* دکمه + */}
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    {!addingNew && (
                      <button onClick={() => { setAddingNew(true); setEditIndex(null); }} className="text-3xl text-green-600 hover:scale-110">+</button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminUsers;
