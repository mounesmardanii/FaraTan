import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { api } from "../../lib/api";
import { fromPlanServer, toPlanServer, detectType } from "../../lib/helpers.plan";
import { toast } from "react-toastify";

const TYPE_NAME = "عمومی";

function GeneralCoursePage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);      
  const [newRow, setNewRow] = useState({ sessions: "", price: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api("/api/v1/plan/all-plans");
        const list = (Array.isArray(data) ? data : [])
          .filter(p => detectType(p?.name || "") === TYPE_NAME)
          .map(fromPlanServer);
        setRows(list);
      } catch (e) {
        toast.error(`خطا در دریافت پلن‌ها: ${e instanceof Error ? e.message : e}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddRow = async () => {
    if (!newRow.sessions.trim() || !newRow.price.trim()) {
      toast.error("تعداد جلسه و قیمت را کامل وارد کنید.");
      return;
    }
    try {
      const payload = toPlanServer({ type: TYPE_NAME, ...newRow });
      const { data } = await api("/api/v1/plan/", { method: "POST", body: payload });
      const added = fromPlanServer(data);
      setRows(prev => [...prev, added]);
      setNewRow({ sessions: "", price: "" });
      toast.success("پلن با موفقیت افزوده شد");
    } catch (e) {
      toast.error(`خطا در افزودن پلن: ${e instanceof Error ? e.message : e}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { status } = await api(`/api/v1/plan/${id}`, { method: "DELETE" });
      if (status === 200 || status === 204) {
        setRows(prev => prev.filter(r => r.id !== id));
        toast.success("پلن حذف شد");
      } else {
        toast.error(`حذف ناموفق (status ${status})`);
      }
    } catch (e) {
      toast.error(`خطا در حذف پلن: ${e instanceof Error ? e.message : e}`);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative p-4 md:p-15">
      <main
        dir="rtl"
        className="flex-1 border-r-2 border-l-2 border-t-2 border-[#055B5C]
        rounded-t-[30px] md:rounded-tl-[70px] bg-white text-right p-4 md:p-6 relative min-h-screen"
      >
        <button onClick={() => navigate(-1)} className="absolute top-4 right-4 hover:opacity-70 transition cursor-pointer" title="بازگشت">
          <img src={assets.back} alt="بازگشت" className="w-8 h-8" />
        </button>

        <h2 className="text-center text-[#FF6600] font-bold text-xl mb-6">دوره‌های {TYPE_NAME}</h2>

        {loading ? (
          <div className="text-center text-sm text-[#055B5C]">در حال بارگذاری...</div>
        ) : (
          <div className="w-full h-full">
            <div className="w-full h-full overflow-auto rounded-lg scrollbar-thin scrollbar-thumb-[#D1E7D8] scrollbar-track-[#EFFAF2]">
              <table className="min-w-full text-sm font-bold text-[#055B5C] text-center border-separate border-spacing-y-2 table-fixed">
                <thead>
                  <tr className="bg-[#055B5C] text-white">
                    <th>تعداد جلسه</th>
                    <th>قیمت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="bg-[#EFFAF2] rounded h-10">
                      <td>{row.sessions}</td>
                      <td>{row.price} ریال</td>
                      <td className="flex justify-center gap-1 py-1">
                        <button onClick={() => handleDelete(row.id)} className="bg-[#EFFAF2] hover:bg-red-100 text-[#FF6347] text-xs px-2 py-1 rounded cursor-pointer">
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-[#D1E7D8] rounded h-10">
                    <td>
                      <input type="number" name="sessions" value={newRow.sessions}
                        onChange={(e) => setNewRow({ ...newRow, sessions: e.target.value })}
                        className="w-full border px-1 rounded text-xs h-8" placeholder="عدد جلسات" min="1" step="1" />
                    </td>
                    <td>
                      <input type="number" name="price" value={newRow.price}
                        onChange={(e) => setNewRow({ ...newRow, price: e.target.value })}
                        className="w-full border px-1 rounded text-xs h-8" placeholder="قیمت" min="0" step="1000" />
                    </td>
                    <td>
                      <button onClick={handleAddRow} title="افزودن"
                        className="bg-[#055B5C] text-white w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-[#033f40] cursor-pointer mx-auto">+</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default GeneralCoursePage;
