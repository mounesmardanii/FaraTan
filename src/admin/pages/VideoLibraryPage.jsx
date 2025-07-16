import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

// کش فایل ویدیویی در حافظه موقت
const fileCache = new Map();

// گرفتن لیست ویدیوها از localStorage
const fetchVideos = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("videoLibrary")) || [];
    return stored;
  } catch (error) {
    console.error("خطا در بازیابی ویدیوها:", error);
    return [];
  }
};

// ذخیره لیست ویدیوها در localStorage
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
      setError("لطفاً یک فایل ویدیویی انتخاب کنید.");
      return;
    }

    const newVideo = {
      id: Date.now(),
      name: file.name,
    };

    fileCache.set(newVideo.id, file);

    const updated = [...videos, newVideo];
    setVideos(updated);
    saveVideos(updated);
    setError("");
  };

  const handleDelete = (id) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    saveVideos(updated);
    fileCache.delete(id);

    if (selectedVideoId === id) setSelectedVideoId(null);
    if (editingId === id) {
      setEditingId(null);
      setEditName("");
    }
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSaveEdit = (id) => {
    const fileInput = document.getElementById(`edit-file-${id}`);
    const file = fileInput?.files[0];

    const updated = videos.map((v) =>
      v.id === id ? { ...v, name: editName || v.name } : v
    );

    if (file) fileCache.set(id, file);

    setVideos(updated);
    saveVideos(updated);
    setEditingId(null);
    setEditName("");
  };

  const handleChoose = (id) => {
    setSelectedVideoId(id);
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
        setError("فایل انتخاب‌شده موجود نیست. لطفاً دوباره آپلود کنید.");
      }
    }
  };

  return (
    <div className="p-6 bg-[#FFF5EB] min-h-screen" dir="rtl">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 z-10"
        title="بازگشت"
      >
        <img
          src={assets.back}
          alt="بازگشت"
          className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer"
        />
      </button>

      <h2 className="text-xl font-bold text-[#FF6600] text-center mb-8">
        کتابخانه ویدیوهای آموزشی
      </h2>

      <div className="flex justify-center mb-6">
        <label className="cursor-pointer flex flex-col items-center gap-2 bg-white border border-orange-300 px-4 py-3 rounded-xl shadow hover:shadow-md transition">
          <img
            src={assets.upload || "/upload-icon.png"}
            alt="آپلود"
            className="w-8 h-8"
          />
          <span className="text-sm text-[#055B5C] font-semibold">
            افزودن ویدیو جدید
          </span>
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((v) => (
          <div
            key={v.id}
            className={`bg-white rounded-xl border p-3 shadow transition ${
              selectedVideoId === v.id
                ? "border-green-500 ring-2 ring-green-300"
                : "border-orange-200"
            }`}
          >
            {editingId === v.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="نام ویدیو"
                  className="w-full border px-2 py-1 rounded text-sm"
                />
                <input
                  type="file"
                  id={`edit-file-${v.id}`}
                  accept="video/*"
                  className="text-sm"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => handleSaveEdit(v.id)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                  >
                    ذخیره
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-3 py-1 rounded"
                  >
                    لغو
                  </button>
                </div>
              </div>
            ) : (
              <>
                <video
                  src={
                    fileCache.get(v.id)
                      ? URL.createObjectURL(fileCache.get(v.id))
                      : ""
                  }
                  controls
                  className="w-full h-36 rounded-md mb-2"
                />
                <p className="text-xs text-center text-gray-600 truncate">
                  {v.name}
                </p>
                <div className="flex justify-between items-center mt-3 text-sm">
                  <button
                    onClick={() => handleChoose(v.id)}
                    className="text-green-600 hover:underline"
                  >
                    انتخاب
                  </button>
                  <button
                    onClick={() => handleEdit(v.id, v.name)}
                    className="text-blue-600 hover:underline"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="text-red-500 hover:underline"
                  >
                    حذف
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {selectedVideoId && (
        <div className="text-center mt-8">
          <button
            onClick={handleConfirmSelect}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow"
          >
            تایید انتخاب و بازگشت
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoLibraryPage;
