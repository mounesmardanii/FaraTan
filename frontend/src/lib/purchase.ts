// src/lib/purchase.ts
import { api } from "./api";

export type ManualPurchaseCreate = {
  member_id: string;
  plan_id: string;
  session_count: number;
  amount: number;
  // یکی از این‌ها طبق Swagger بک‌اند
  payment_method: "CASH" | "CARD" | "POS" | "GATEWAY" | string;
  // تاریخ به‌صورت رشته: می‌تونی YYYY-MM-DD یا ISO بدهی (بک‌ات هرکدوم را قبول می‌کند)
  paid_at: string;
};

export type ManualPurchaseUpdate = Partial<ManualPurchaseCreate> & {
  // وضعیت لغو: بعضی بک‌اندها Canceled می‌خواهند، بعضی Cancelled
  status?: string;
};

export const purchaseApi = {
  // جدول همه‌ی خریدها
  listAll: () => api("/api/v1/purchase/purchase-table"),

  // ساخت خرید دستی
  createManual: (payload: ManualPurchaseCreate) =>
    api("/api/v1/purchase/manual", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // ویرایش خرید دستی (مثلاً برای تغییر status)
  updateManual: (purchaseId: string, payload: ManualPurchaseUpdate) =>
    api(`/api/v1/purchase/manual/${purchaseId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // حذف سخت (DELETE مستقیم) — اگر لازم شد
  hardDelete: (purchaseId: string) =>
    api(`/api/v1/purchase/manual/${purchaseId}`, { method: "DELETE" }),

  // لغو «هوشمند»: اول PUT با دو املا امتحان می‌کند، در نهایت DELETE
  cancelSmart: async (purchaseId: string) => {
    // 1) PUT با "Cancelled"
    try {
      const r1 = await api(`/api/v1/purchase/manual/${purchaseId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Cancelled" }),
      });
      return r1; // 200OK
    } catch (_) {}

    // 2) PUT با "Canceled"
    try {
      const r2 = await api(`/api/v1/purchase/manual/${purchaseId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Canceled" }),
      });
      return r2; // 200OK
    } catch (_) {}

    // 3) اگر هیچ‌کدام جواب نداد: DELETE
    return api(`/api/v1/purchase/manual/${purchaseId}`, { method: "DELETE" }); // 204 یا 200
  },
};
