import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { assets } from '../../../assets/assets';
import UserTable from './UserTable';
import UserModal from './UserModal';


function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', lastName: '', sport: '', course: '' });
  const [addingNew, setAddingNew] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const dummy = [
      {
        id: 1, name: 'ملاحت', lastName: 'مردانی', sport: 'بدنسازی', course: 'VIP',
        target: 'لاغری', height: 160, weight: 65, arm: 65, chest: 65, butt: 65, absence: 3,
        avatar: assets.woman4
      },
      {
        id: 2, name: 'غزل', lastName: 'نادری', sport: 'ایروبیک', course: 'خصوصی',
        target: 'لاغری', height: 160, weight: 65, arm: 65, chest: 65, butt: 65, absence: 3,
        avatar: assets.woman4
      },
      {
        id: 3, name: 'مونس', lastName: 'مردانی', sport: 'ایروبیک', course: 'عمومی',
        target: 'افزایش انعطاف', height: 158, weight: 60, arm: 60, chest: 60, butt: 62, absence: 1,
        avatar: assets.woman4
      },
    ];
    setUsers(dummy);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const resetForm = () => {
    setEditIndex(null);
    setFormData({ name: '', lastName: '', sport: '', course: '' });
    setAddingNew(false);
  };

  const handleAddUser = () => {
    if (!formData.name.trim() || !formData.lastName.trim()) {
      alert('نام و نام خانوادگی الزامی است');
      return;
    }
    const newUser = {
      ...formData,
      id: Date.now(),
      avatar: assets.woman4
    };
    setUsers([...users, newUser]);
    resetForm();
  };

  const handleEdit = (user) => {
    setEditIndex(user.id);
    setFormData(user);
    setAddingNew(false);
  };

  const handleSaveEdit = () => {
    setUsers(users.map(u => u.id === formData.id ? { ...formData, avatar: assets.woman4 } : u));
    resetForm();
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    resetForm();
  };

  const handleAddNewClick = () => {
    setAddingNew(true);
    setFormData({ name: '', lastName: '', sport: '', course: '' });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative mt-4">
        <aside className="hidden md:flex mt-3 w-64 z-30 border-t-[3px] border-r-[3px] border-[#055B5C] rounded-tr-[75px]">
          <AdminSidebar />
        </aside>

        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: sidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed md:hidden top-[4rem] left-0 z-50 w-[275px] h-[calc(100vh-4rem)] bg-[#D1E7D8] border-t-[3px] border-r-[3px] border-[#055B5C] rounded-tr-[75px] p-6 overflow-y-auto mt-13"
        >
          <AdminSidebar />
        </motion.aside>

        {sidebarOpen && (
          <div
            className="fixed md:hidden inset-0 top-[4rem] z-40 bg-black/50 mt-13.5"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main
          dir="rtl"
          className={`flex-1 p-4 md:p-8 relative z-10 border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white flex flex-col gap-6 text-right mt-3 ml-10 md:ml-10 ${sidebarOpen ? 'pointer-events-none select-none' : ''}`}
        >
          <motion.div
            className="flex items-center border-2 border-[#9FC6C3] rounded-full px-3 py-1 md:px-4 md:py-2 w-full max-w-[80%] md:max-w-sm mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <input
              type="text"
              placeholder="نام را وارد کنید..."
              className="flex-1 outline-none bg-transparent text-right text-[10px] md:text-xs text-[#055B5C]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          <motion.h2
            className="text-center text-orange-600 font-bold text-base"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            لیست اعضای باشگاه
          </motion.h2>

          <UserTable
            users={filteredUsers}
            formData={formData}
            setFormData={setFormData}
            handleAddUser={handleAddUser}
            handleEdit={handleEdit}
            handleSaveEdit={handleSaveEdit}
            handleDeleteUser={handleDeleteUser}
            handleAddNewClick={handleAddNewClick}
            resetForm={resetForm}
            editIndex={editIndex}
            addingNew={addingNew}
            setSelectedUser={setSelectedUser}
          />
        </main>
      </div>

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

export default AdminUsers;