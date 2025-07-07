import React, { useState } from 'react';
import uploadIcon from '../../../assets/upload.png';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { motion } from 'framer-motion';

const AddFitnessClassForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    coach: '',
    price: '',
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, duration, coach, price, image } = formData;

    if (!title || !duration || !coach || !price || !image) {
      setError('⚠️ لطفاً تمام فیلدها را کامل پر کنید.');
      return;
    }

    setError('');
    const data = new FormData();
    data.append('title', title);
    data.append('duration', duration);
    data.append('coach', coach);
    data.append('price', price);
    data.append('image', image);

    console.log(Object.fromEntries(data));
    alert('✅ کلاس با موفقیت اضافه شد');

    setFormData({
      title: '',
      duration: '',
      coach: '',
      price: '',
      image: null,
    });
    setPreview(null);
  };

  console.log('Component rendered at:', new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' }));

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-right relative">
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
          className={`flex-1 px-4 py-6 md:p-10 z-10 border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white md:ml-10 text-right mt-3 ml-10 ${
            sidebarOpen ? 'pointer-events-none select-none' : ''
          }`}
        >
          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[90%] md:max-w-lg bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-orange-100 animate-fade-in"
              encType="multipart/form-data"
            >
              <h2 className="text-[#055B5C] font-extrabold text-xl md:text-2xl mb-4 md:mb-6 text-center border-b-2 border-orange-400 pb-2">
                اضافه کردن کلاس ورزشی
              </h2>

              <label htmlFor="imageInput" className="block text-[#055B5C] text-xs md:text-sm mb-1">
                عکس کلاس:
              </label>
              <label
                htmlFor="imageInput"
                className="cursor-pointer flex items-center justify-center w-full h-32 md:h-40 mb-4 md:mb-5 rounded-lg bg-orange-50 hover:bg-orange-100 transition border border-dashed border-orange-300"
                style={{ cursor: 'pointer' }} 
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-full object-cover rounded-lg w-full"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <img src={uploadIcon} alt="upload icon" className="w-8 h-8 md:w-10 md:h-10 opacity-70" />
                    <span className="text-xs md:text-sm text-[#055B5C] mt-2">آپلود عکس</span>
                  </div>
                )}
              </label>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {['title', 'duration', 'coach', 'price'].map((field, index) => (
                <div className="mb-3 md:mb-4" key={index}>
                  <label className="block text-xs md:text-sm text-[#055B5C] mb-1">
                    {field === 'title'
                      ? 'نام کلاس:'
                      : field === 'duration'
                      ? 'مدت دوره:'
                      : field === 'coach'
                      ? 'مربی ورزشی:'
                      : 'قیمت (تومان):'}
                  </label>
                  <input
                    type={field === 'price' ? 'number' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border border-[#055B5C] rounded-md p-1.5 md:p-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                  />
                </div>
              ))}

              {error && (
                <div className="text-red-600 text-xs md:text-sm text-center mb-2 md:mb-3 animate-pulse">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#F45C25] text-white font-semibold py-1.5 md:py-2 rounded-md text-xs md:text-base hover:bg-[#e45320] transition duration-300 shadow-sm cursor-pointer"
                style={{ cursor: 'pointer' }} 
              >
                اضافه کردن کلاس
              </button>
            </form>
          </div>
        </main>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default AddFitnessClassForm;