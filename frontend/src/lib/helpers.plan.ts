// src/lib/helpers.plan.ts
export type PlanServer = {
  id: string;
  name: string;            // مثال: "VIP 12" یا "عمومی 8"
  session_count: number;
  price: number;
  created_at?: string;
  updated_at?: string;
};

export type PlanUI = {
  id?: string;
  type: string;            // 'VIP' | 'عمومی' | 'خصوصی'
  sessions: string;
  price: string;
};

// ارقام فارسی/عربی → انگلیسی (ایمن)
export const fa2en = (val: unknown) =>
  String(val ?? '')
    .replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)] ?? d)
    .replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)] ?? d);

// تشخیص نوع از روی name
export const detectType = (name = '') => {
  const n = String(name).toLowerCase();
  if (/vip/.test(n) || /وی.?آی.?پی/.test(name)) return 'VIP';
  if (/خصوص/.test(name) || /private/.test(n))  return 'خصوصی';
  if (/عموم/.test(name) || /general/.test(n))  return 'عمومی';
  return 'سایر';
};

export function fromPlanServer(p: PlanServer): PlanUI {
  return {
    id: p.id,
    type: p.name, // برای نمایشِ نوع واقعی از detectType استفاده می‌کنیم
    sessions: String(p.session_count ?? ''),
    price: String(p.price ?? ''),
  };
}

export function toPlanServer(u: Partial<PlanUI>): Partial<PlanServer> {
  const type = String(u.type || '').trim();              // 'VIP' | 'عمومی' | 'خصوصی'
  const sessionsNum = Number(fa2en(u.sessions));
  const priceNum = Number(fa2en(u.price));

  // جلوگیری از Duplicate: نام یکتا = نوع + تعداد جلسه
  const uniqueName = type ? `${type} ${sessionsNum}` : String(sessionsNum);

  return {
    name: uniqueName,
    session_count: Number.isFinite(sessionsNum) ? sessionsNum : 0,
    price: Number.isFinite(priceNum) ? priceNum : 0,
  };
}
