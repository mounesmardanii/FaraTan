import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import {
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiUpload,
  FiArrowLeft,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Framer Motion

const fileCache = new Map();

const fetchVideos = () => {
  try {
    return JSON.parse(localStorage.getItem("videoLibrary")) || [];
  } catch (error) {
    console.error("خطا در بازیابی ویدیوها:", error);
    return [];
  }
};

const saveVideos = (videos) => {
  try {
    localStorage.setItem("videoLibrary", JSON.stringify(videos));
  } catch (error) {
    console.error("خطا در ذخیره ویدیوها:", error);
  }
};

function VideoLibraryPage() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadedVideos = fetchVideos();
    setVideos(loadedVideos);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.includes("video")) {
      setError("لطفاً یک فایل ویدیویی معتبر انتخاب کنید");
      return;
    }

    const newVideo = {
      id: Date.now(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      fileName: file.name,
      type: "عمومی",
    };

    fileCache.set(newVideo.id, file);
    const updated = [...videos, newVideo];
    setVideos(updated);
    saveVideos(updated);
    setError("");
    setEditingId(newVideo.id);
    setEditName(newVideo.name);
  };

  const handleDelete = (id) => {
    if (window.confirm("آیا از حذف این ویدیو مطمئن هستید؟")) {
      const updated = videos.filter((v) => v.id !== id);
      setVideos(updated);
      saveVideos(updated);
      fileCache.delete(id);
      if (selectedVideoId === id) setSelectedVideoId(null);
      if (editingId === id) {
        setEditingId(null);
        setEditName("");
      }
    }
  };

  const handleSaveEdit = (id) => {
    const fileInput = document.getElementById(`edit-file-${id}`);
    const file = fileInput?.files[0];

    const updated = videos.map((v) =>
      v.id === id
        ? {
            ...v,
            name: editName || v.name,
            fileName: file ? file.name : v.fileName,
          }
        : v
    );

    if (file) fileCache.set(id, file);
    setVideos(updated);
    saveVideos(updated);
    setEditingId(null);
    setEditName("");
  };

  const handleConfirmSelect = () => {
    const selected = videos.find((v) => v.id === selectedVideoId);
    if (selected) {
      const file = fileCache.get(selected.id);
      if (file) {
        localStorage.setItem(
          "selectedVideo",
          JSON.stringify({
            ...selected,
            file: URL.createObjectURL(file),
          })
        );
        navigate(-1);
      } else {
        setError("فایل ویدیو یافت نشد. لطفاً دوباره آپلود کنید.");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#FFF5EB] min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#055B5C] hover:opacity-70 transition cursor-pointer"
          >
            <img src={assets.back} alt="بازگشت" className="w-8 h-8" />
          </button>
          <h1 className="text-2xl font-bold text-[#055B5C]">
            لیست ویدیوهای آموزشی
          </h1>
          <div></div>
        </div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-[#FFE8D6] p-6 mb-8"
        >
          <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[#FFD8B8] rounded-lg p-6 hover:border-[#FF6600] transition-colors">
            <div className="bg-[#FFF0E5] p-3 rounded-full mb-3">
              <FiUpload className="text-2xl text-[#FF6600]" />
            </div>
            <span className="text-lg font-medium text-[#055B5C] mb-1">
              افزودن ویدیو جدید
            </span>
            <span className="text-sm text-[#7A8C94] mb-3">
              فرمت‌های مجاز: MP4, MOV, AVI
            </span>
            <input
              type="file"
              accept="video/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
          {error && (
            <div className="mt-4 text-center text-red-500 text-sm">{error}</div>
          )}
        </motion.div>

        {/* Video Grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-xl shadow-sm border border-[#FFE8D6] overflow-hidden transition-all ${
                    selectedVideoId === video.id
                      ? "ring-2 ring-[#FF6600] transform scale-[1.02]"
                      : "hover:shadow-md"
                  }`}
                >
                  {editingId === video.id ? (
                    <div className="p-4 bg-[#FFF9F2]">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-[#055B5C] mb-1">
                          عنوان ویدیو
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 border border-[#FFD8B8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                          placeholder="مثال: آموزش اسکوات"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-[#055B5C] mb-1">
                          نوع ویدیو
                        </label>
                        <select
                          value={video.type}
                          onChange={(e) => {
                            const updated = videos.map((v) =>
                              v.id === video.id
                                ? { ...v, type: e.target.value }
                                : v
                            );
                            setVideos(updated);
                          }}
                          className="w-full px-3 py-2 border border-[#FFD8B8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        >
                          <option value="عمومی">عمومی</option>
                          <option value="خصوصی">خصوصی</option>
                          <option value="VIP">VIP</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-[#055B5C] mb-1">
                          تغییر فایل ویدیو
                        </label>
                        <input
                          type="file"
                          id={`edit-file-${video.id}`}
                          accept="video/*"
                          className="block w-full text-sm text-[#7A8C94] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#FFF0E5] file:text-[#FF6600] hover:file:bg-[#FFE8D6]"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 text-[#7A8C94] hover:text-[#055B5C]"
                        >
                          <FiX />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSaveEdit(video.id)}
                          className="px-4 py-2 bg-[#FF6600] text-white rounded-md hover:bg-[#E55C00] flex items-center cursor-pointer"
                        >
                          <FiCheck className="ml-1" />
                          ذخیره
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <video
                          src={
                            fileCache.get(video.id)
                              ? URL.createObjectURL(fileCache.get(video.id))
                              : ""
                          }
                          controls
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {video.fileName}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-[#055B5C] mb-1">
                          {video.name}
                        </h3>
                        <span className="inline-block bg-[#FFF0E5] text-[#FF6600] text-xs px-2 py-1 rounded-full mb-3">
                          {video.type}
                        </span>

                        <div className="flex justify-between items-center">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedVideoId(video.id)}
                            className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                              selectedVideoId === video.id
                                ? "bg-[#FF6600] text-white"
                                : "text-[#FF6600] hover:bg-[#FFF0E5]"
                            }`}
                          >
                            {selectedVideoId === video.id
                              ? "انتخاب شده"
                              : "انتخاب"}
                          </motion.button>

                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => {
                                setEditingId(video.id);
                                setEditName(video.name);
                              }}
                              className="p-2 text-[#055B5C] hover:bg-[#EFFAF2] rounded-full cursor-pointer"
                              title="ویرایش"
                            >
                              <FiEdit size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleDelete(video.id)}
                              className="p-2 text-[#FF3B30] hover:bg-[#FFEEED] rounded-full cursor-pointer"
                              title="حذف"
                            >
                              <FiTrash2 size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-[#FFE8D6] p-8 text-center"
          >
            <h3 className="text-lg font-medium text-[#055B5C] mb-2">
              لیست ویدیو خالی است
            </h3>
          </motion.div>
        )}

        {/* Confirm Selection Button */}
        {selectedVideoId && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirmSelect}
              className="bg-[#FF6600] hover:bg-[#E55C00] text-white font-medium py-3 px-8 rounded-full shadow-lg flex items-center transition-all transform cursor-pointer"
            >
              تایید ویدیو انتخاب شده
              <FiArrowLeft className="mr-2" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoLibraryPage;
