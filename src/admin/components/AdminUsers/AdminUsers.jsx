import React, { useEffect, useState, useMemo } from 'react';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { assets } from '../../../assets/assets';
import { motion } from 'framer-motion';

function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', lastName: '', sport: '', course: '' });
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    const dummy = [
      { id: 1, name: 'غزل', lastName: 'نادری', sport: 'ایروبیک', course: 'یک ساله', avatar: assets.woman4 },
      { id: 2, name: 'مونِس', lastName: 'مردانی', sport: 'ایروبیک', course: 'سه ماهه', avatar: assets.woman4 },
    ];
    setUsers(dummy);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const handleAddUser = () => {
    if (!formData.name.trim() || !formData.lastName.trim()) return;
    const newUser = {
      ...formData,
      id: Date.now(),
      avatar: assets.woman4
    };
    setUsers([...users, newUser]);
    resetForm();
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    resetForm();
  };

  const handleSaveEdit = () => {
    setUsers(users.map(u => u.id === formData.id ? { ...formData, avatar: assets.woman4 } : u));
    resetForm();
  };

  const handleEdit = (user) => {
    setEditIndex(user.id);
    setFormData(user);
    setAddingNew(false);
  };

  const resetForm = () => {
    setEditIndex(null);
    setFormData({ name: '', lastName: '', sport: '', course: '' });
    setAddingNew(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-right relative">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative mt-4">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex mt-[4.5rem] w-64 z-30 border-t-[3px] border-r-[3px] border-[#055B5C] rounded-tr-[75px]">

          <AdminSidebar />
        </aside>

        {/* Sidebar Mobile */}
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: sidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed md:hidden top-[4rem] left-0 z-50 w-[275px] h-[calc(100vh-4rem)] bg-[#D1E7D8] border-t-[3px] border-r-[3px] border-[#055B5C] rounded-tr-[75px] p-6 overflow-y-auto"
        >
          <AdminSidebar />
        </motion.aside>

        {sidebarOpen && (
          <div
            className="fixed md:hidden inset-0 top-[4rem] z-40  bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main
          dir="rtl"
          className={`flex-1 p-4 md:p-10 z-10 overflow-y-auto border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white ml-0 md:ml-10 mt-3 ml-10${
            sidebarOpen ? 'pointer-events-none select-none' : ''
          }`}
        >
          {/* Search Bar */}
          <div className="flex items-center border-2 border-[#9FC6C3] rounded-full px-4 py-2 w-full max-w-md self-center mb-4">
            <input
              type="text"
              placeholder="نام را وارد کنید..."
              className="flex-1 outline-none bg-transparent text-right text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <h2 className="text-center text-orange-600 font-bold text-lg mb-4">لیست اعضای باشگاه</h2>

          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto text-center text-sm text-[#055B5C] font-semibold rounded-xl overflow-hidden">
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
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="bg-[#EAF4EF] border-b border-[#ccc]">
                    <td className="py-2">
                      <img src={u.avatar} alt="avatar" className="w-10 h-10 rounded-full mx-auto" />
                    </td>
                    {editIndex === u.id ? (
                      <>
                        {['name', 'lastName', 'sport', 'course'].map((key) => (
                          <td key={key}>
                            <input
                              value={formData[key]}
                              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                        ))}
                        <td>
                          <div className="flex gap-2 justify-center flex-wrap">
                            <button onClick={handleSaveEdit} className="text-green-600 bg-green-100 px-3 py-1 rounded text-sm">ذخیره</button>
                            <button onClick={resetForm} className="text-gray-600 bg-gray-200 px-3 py-1 rounded text-sm">لغو</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{u.name}</td>
                        <td>{u.lastName}</td>
                        <td>{u.sport}</td>
                        <td>{u.course}</td>
                        <td>
                          <div className="flex gap-2 justify-center flex-wrap">
                            <button onClick={() => handleEdit(u)} className="text-blue-600 bg-blue-100 px-3 py-1 rounded text-sm">ویرایش</button>
                            <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 bg-red-100 px-3 py-1 rounded text-sm">حذف</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {addingNew && (
                  <tr className="bg-[#F9F9F9] border-t">
                    <td></td>
                    {['name', 'lastName', 'sport', 'course'].map((key) => (
                      <td key={key}>
                        <input
                          value={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </td>
                    ))}
                    <td>
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button onClick={handleAddUser} className="text-green-600 bg-green-100 px-3 py-1 rounded text-sm">ثبت</button>
                        <button onClick={resetForm} className="text-gray-600 bg-gray-200 px-3 py-1 rounded text-sm">لغو</button>
                      </div>
                    </td>
                  </tr>
                )}

                {!addingNew && !editIndex && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <button
                        onClick={() => { setAddingNew(true); resetForm(); }}
                        className="cursor-pointer text-3xl text-green-600 hover:scale-110"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminUsers;
