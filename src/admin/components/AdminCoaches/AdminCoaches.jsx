import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { assets } from '../../../assets/assets';

function AdminCoaches() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [coaches, setCoaches] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', lastName: '', specialty: '', workExperience: '', age: '', phoneNumber: '' });
  const [addingNew, setAddingNew] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dummy = [
      { id: 1, name: 'ملاحت', lastName: 'مردانی', specialty: 'ایروبیک', workExperience: '5 سال', age: '30', phoneNumber: '09123456789', avatar: assets.woman1 },
      { id: 2, name: 'سارا', lastName: 'احمدی', specialty: 'فیتنس', workExperience: '3 سال', age: '28', phoneNumber: '09129876543', avatar: assets.woman4 },
    ];
    setCoaches(dummy);
  }, []);

  const filteredCoaches = useMemo(() => {
    return coaches.filter(coach =>
      coach.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, coaches]);

  const handleAddCoach = () => {
    if (!formData.name.trim() || !formData.lastName.trim() || !formData.specialty.trim() || !formData.workExperience.trim() || !formData.age.trim() || !formData.phoneNumber.trim()) {
      alert('تمامی فیلدها (نام، نام خانوادگی، تخصص، سابقه کاری، سن و شماره تماس) الزامی است');
      return;
    }
    try {
      const newCoach = {
        ...formData,
        id: Date.now(),
        avatar: assets.woman1
      };
      setCoaches([...coaches, newCoach]);
      resetForm();
      console.log('New coach added:', newCoach);
    } catch (error) {
      console.error('Error adding coach:', error);
    }
  };

  const handleDeleteCoach = (id) => {
    try {
      setCoaches(coaches.filter(c => c.id !== id));
      resetForm();
      console.log('Coach deleted:', id);
    } catch (error) {
      console.error('Error deleting coach:', error);
    }
  };

  const handleSaveEdit = () => {
    try {
      setCoaches(coaches.map(c => c.id === formData.id ? { ...formData, avatar: assets.man1 } : c));
      resetForm();
      console.log('Coach edited:', formData);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleEdit = (coach) => {
    try {
      setEditIndex(coach.id);
      setFormData({ ...coach, avatar: assets.woman1 });
      setAddingNew(false);
      console.log('Editing coach:', coach);
    } catch (error) {
      console.error('Error starting edit:', error);
    }
  };

  const resetForm = () => {
    try {
      setEditIndex(null);
      setFormData({ name: '', lastName: '', specialty: '', workExperience: '', age: '', phoneNumber: '' });
      setAddingNew(false);
      console.log('Form reset');
    } catch (error) {
      console.error('Error resetting form:', error);
    }
  };

  const handleAddNewClick = () => {
    try {
      console.log('Plus button clicked, adding new coach');
      setAddingNew(true);
      setFormData({ name: '', lastName: '', specialty: '', workExperience: '', age: '', phoneNumber: '', avatar: assets.woman1 });
    } catch (error) {
      console.error('Error in handleAddNewClick:', error);
    }
  };

  const handleScheduleClass = (coachId) => {
    try {
      navigate(`/admin/coach-schedule/${coachId}`);
      console.log('Navigating to schedule for coach:', coachId);
    } catch (error) {
      console.error('Error navigating to schedule:', error);
    }
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
            لیست مربیان
          </motion.h2>

          {/* Desktop Table */}
          <motion.div
            className="bg-[#D1E7D8] rounded-xl shadow p-4 w-full max-w-[95%] mx-auto hidden md:block"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="w-full overflow-x-auto">
              <table className="min-w-[500px] text-[10px] md:text-xs text-[#055B5C] text-center font-semibold">
                <thead>
                  <tr className="bg-[#EAF4EF] border-b border-[#ccc]">
                    <th className="py-2 px-1 md:px-2 w-[10%] whitespace-nowrap">پروفایل</th>
                    <th className="py-2 px-1 md:px-2 w-[15%] whitespace-nowrap">نام</th>
                    <th className="py-2 px-1 md:px-2 w-[15%] whitespace-nowrap">نام خانوادگی</th>
                    <th className="py-2 px-1 md:px-2 w-[15%] whitespace-nowrap">تخصص</th>
                    <th className="py-2 px-1 md:px-2 w-[15%] whitespace-nowrap">سابقه کاری</th>
                    <th className="py-2 px-1 md:px-2 w-[10%] whitespace-nowrap">سن</th>
                    <th className="py-2 px-1 md:px-2 w-[15%] whitespace-nowrap">شماره تماس</th>
                    <th className="py-2 px-1 md:px-2 w-[25%] whitespace-nowrap">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoaches.map((c, i) => (
                    <tr
                      key={c.id}
                      className="bg-[#EAF4EF] border-b border-[#ccc]"
                    >
                      <td className="py-2 px-1 md:px-2 whitespace-nowrap">
                        <img src={c.avatar} alt="avatar" className="w-6 h-6 md:w-8 md:h-8 rounded-full mx-auto" onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; console.log('Avatar failed to load, using placeholder'); }} />
                      </td>
                      {editIndex === c.id ? (
                        <>
                          {['name', 'lastName', 'specialty', 'workExperience', 'age', 'phoneNumber'].map((key) => (
                            <td key={key} className="py-2 px-1 md:px-2 whitespace-nowrap">
                              <input
                                value={formData[key]}
                                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                className="w-full px-1 md:px-2 py-1 border rounded text-[10px] md:text-xs text-right truncate"
                                placeholder={key === 'name' ? 'نام' : key === 'lastName' ? 'نام خانوادگی' : key === 'specialty' ? 'تخصص' : key === 'workExperience' ? 'سابقه کاری' : key === 'age' ? 'سن' : 'شماره تماس'}
                              />
                            </td>
                          ))}
                          <td className="py-2 px-1 md:px-2 whitespace-nowrap">
                            <div className="flex gap-1 md:gap-2 justify-center flex-wrap">
                              <button onClick={handleSaveEdit} className="text-green-600 bg-green-100 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-green-200 transition cursor-pointer min-w-[60px]">ذخیره</button>
                              <button onClick={resetForm} className="text-gray-600 bg-gray-200 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-gray-300 transition cursor-pointer min-w-[60px]">لغو</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-1 md:px-2 whitespace-nowrap truncate">{c.name}</td>
                          <td className="py-2 px-1 md:px-2 whitespace-nowrap truncate">{c.lastName}</td>
                          <td className="py-2 px-1 md:px-2 whitespace-nowrap truncate">{c.specialty}</td>
                          <td className="py-2 px-1 md:px-2 whitespace-nowrap truncate">{c.workExperience}</td>
                          <td className="py-2 px-1 md:px-2 whitespace-nowrap truncate">{c.age}</td>
                          <td className="py-2 px-1 md:px-2 whitespace-nowrap truncate">{c.phoneNumber}</td>
                          <td className="py-2 px-1 md:px-2 whitespace-nowrap min-w-[200px]">
                            <div className="flex gap-1 md:gap-2 justify-center items-center flex-wrap">
                              <button onClick={() => handleEdit(c)} className="text-blue-600 bg-blue-100 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-blue-200 transition cursor-pointer whitespace-nowrap min-w-[60px]">ویرایش</button>
                              <button onClick={() => handleDeleteCoach(c.id)} className="text-red-600 bg-red-100 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-red-200 transition cursor-pointer whitespace-nowrap min-w-[60px]">حذف</button>
                              <button onClick={() => handleScheduleClass(c.id)} className="text-yellow-600 bg-yellow-100 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-yellow-200 transition cursor-pointer whitespace-nowrap min-w-[80px]">زمان کلاس</button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}

                  {addingNew && (
                    <tr
                      className="bg-[#F9F9F9] border-t"
                    >
                      <td className="py-2 px-1 md:px-2 whitespace-nowrap">
                        <img src={assets.woman1} alt="avatar" className="w-6 h-6 md:w-8 md:h-8 rounded-full mx-auto" onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; console.log('Avatar failed to load, using placeholder'); }} />
                      </td>
                      {['name', 'lastName', 'specialty', 'workExperience', 'age', 'phoneNumber'].map((key) => (
                        <td key={key} className="py-2 px-1 md:px-2 whitespace-nowrap">
                          <input
                            value={formData[key]}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            className="w-full px-1 md:px-2 py-1 border rounded text-[10px] md:text-xs text-right truncate"
                            placeholder={key === 'name' ? 'نام' : key === 'lastName' ? 'نام خانوادگی' : key === 'specialty' ? 'تخصص' : key === 'workExperience' ? 'سابقه کاری' : key === 'age' ? 'سن' : 'شماره تماس'}
                          />
                        </td>
                      ))}
                      <td className="py-2 px-1 md:px-2 whitespace-nowrap">
                        <div className="flex gap-1 md:gap-2 justify-center flex-wrap">
                          <button onClick={handleAddCoach} className="text-green-600 bg-green-100 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-green-200 transition cursor-pointer min-w-[60px]">ثبت</button>
                          <button onClick={resetForm} className="text-gray-600 bg-gray-200 px-2 md:px-3 py-1 rounded text-[10px] md:text-xs hover:bg-gray-300 transition cursor-pointer min-w-[60px]">لغو</button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!addingNew && !editIndex && (
                    <tr
                      key="add-row"
                      className="bg-[#EAF4EF]"
                    >
                      <td colSpan="8" className="text-center py-4">
                        <button
                          onClick={handleAddNewClick}
                          className="text-2xl md:text-3xl text-green-600 hover:text-green-700 transition cursor-pointer"
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Mobile List */}
          <motion.div
            className="bg-[#D1E7D8] rounded-xl shadow p-4 w-full max-w-[95%] mx-auto block md:hidden"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="space-y-4">
              {filteredCoaches.map((c) => (
                <div key={c.id} className="bg-[#EAF4EF] rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <img src={c.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-2" onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                      <div>
                        <h3 className="font-semibold text-[#055B5C]">{c.name} {c.lastName}</h3>
                        <p className="text-xs text-gray-600">{c.specialty}</p>
                      </div>
                    </div>
                    <div className="text-xs">
                      <p>سن: {c.age}</p>
                      <p>سابقه: {c.workExperience}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <a href={`tel:${c.phoneNumber}`} className="text-xs text-blue-600">{c.phoneNumber}</a>
                    
                    <div className="flex space-x-1">
                      <button onClick={() => handleEdit(c)} className="text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs cursor-pointer ">
                        ویرایش
                      </button>
                      <button onClick={() => handleDeleteCoach(c.id)} className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs cursor-pointer ">
                        حذف
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleScheduleClass(c.id)}
                    className="w-full mt-2 text-yellow-600 bg-yellow-100 py-1 rounded text-xs cursor-pointer "
                  >
                    زمان کلاس
                  </button>
                </div>
              ))}

              {addingNew && (
                <div className="bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                  <div className="flex items-center mb-2">
                    <img src={assets.woman1} alt="avatar" className="w-10 h-10 rounded-full mr-2" onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                    <div className="flex-1 space-y-1">
                      {['name', 'lastName', 'specialty', 'workExperience', 'age', 'phoneNumber'].map((key) => (
                        <input
                          key={key}
                          value={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          placeholder={key === 'name' ? 'نام' : key === 'lastName' ? 'نام خانوادگی' : key === 'specialty' ? 'تخصص' : key === 'workExperience' ? 'سابقه کاری' : key === 'age' ? 'سن' : 'شماره تماس'}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center space-x-2 mt-2">
                    <button onClick={handleAddCoach} className="text-green-600 bg-green-100 px-3 py-1 rounded text-xs cursor-pointer ">
                      ثبت
                    </button>
                    <button onClick={resetForm} className="text-gray-600 bg-gray-200 px-3 py-1 rounded text-xs cursor-pointer ">
                      لغو
                    </button>
                  </div>
                </div>
              )}

              {!addingNew && !editIndex && (
                <div className="flex justify-center">
                  <button
                    onClick={handleAddNewClick}
                    className="text-3xl text-green-600 hover:text-green-700 transition cursor-pointer p-2"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default AdminCoaches;