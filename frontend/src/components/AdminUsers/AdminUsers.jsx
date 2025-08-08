// AdminUsers.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { assets } from '../../assets/assets';
import UserTable from './UserTable';

function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: '',
    birthDate: '',
    medicalCondition: '',
    sportGoal: '',
    avatar: assets.woman4,
  });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('usersList')) || [];
    const signupUser = JSON.parse(localStorage.getItem('signupComplete'));

    if (signupUser && !savedUsers.some(u => u.phone === signupUser.phone)) {
      const newUser = {
        id: Date.now(),
        name: signupUser.name || '',
        lastName: signupUser.lastName || '',
        phone: signupUser.phone || '',
        birthDate: signupUser.birthDate || '',
        medicalCondition: signupUser.medicalCondition || '',
        sportGoal: signupUser.sportGoal || '',
        avatar: signupUser.photo || assets.woman4,
      };
      const updated = [...savedUsers, newUser];
      setUsers(updated);
      localStorage.setItem('usersList', JSON.stringify(updated));
    } else {
      setUsers(savedUsers);
    }
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const resetForm = () => {
    setEditIndex(null);
    setAddingNew(false);
    setFormData({
      name: '',
      lastName: '',
      phone: '',
      birthDate: '',
      medicalCondition: '',
      sportGoal: '',
      avatar: assets.woman4,
    });
  };

  const handleEdit = (user) => {
    setEditIndex(user.id);
    setFormData({ ...user });
  };

  const handleSaveEdit = () => {
    const updatedUsers = users.map((u) =>
      u.id === formData.id ? formData : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('usersList', JSON.stringify(updatedUsers));
    resetForm();
  };

  const handleDeleteUser = (id) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem('usersList', JSON.stringify(updated));
    resetForm();
  };

  const handleAddUser = () => {
    if (!formData.name.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
      alert("لطفاً فیلدهای ضروری را پر کنید");
      return;
    }
    const newUser = {
      ...formData,
      id: Date.now(),
      avatar: formData.avatar || assets.woman4,
    };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('usersList', JSON.stringify(updated));
    resetForm();
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
          className={`flex-1 p-4 md:p-8 relative z-10 border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white flex flex-col gap-6 text-right mt-3 ml-10 md:ml-10 ${
            sidebarOpen ? 'pointer-events-none select-none' : ''
          }`}
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
            handleEdit={handleEdit}
            handleSaveEdit={handleSaveEdit}
            handleDeleteUser={handleDeleteUser}
            handleAddUser={handleAddUser}
            resetForm={resetForm}
            editIndex={editIndex}
            addingNew={addingNew}
            setAddingNew={setAddingNew}
            setSelectedUser={setSelectedUser}
          />
        </main>
      </div>
    </div>
  );
}

export default AdminUsers;
